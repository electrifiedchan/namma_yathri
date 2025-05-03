import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getUserStreak, getMockUserStreak, decrementStreak } from '@/src/services/supabaseService';

const RideAcceptedScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const rideDetails = params.rideDetails ? JSON.parse(params.rideDetails) : {};
  const [streakData, setStreakData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch streak data when component mounts
  useEffect(() => {
    const fetchStreakData = async () => {
      try {
        setLoading(true);
        // In a real app, you would get the current user ID
        const userId = 'mock-user-id';
        
        // Try to fetch from Supabase, fall back to mock data
        let data;
        try {
          data = await getUserStreak(userId);
          if (!data) {
            data = getMockUserStreak();
          }
        } catch (error) {
          console.error('Error fetching streak data:', error);
          data = getMockUserStreak();
        }
        
        setStreakData(data);
      } catch (error) {
        console.error('Error in fetchStreakData:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStreakData();
  }, []);

  // Render streak badge
  const renderStreakBadge = () => {
    if (!streakData) return null;
    
    return (
      <View style={styles.streakBadgeContainer}>
        <View style={styles.streakBadge}>
          <Ionicons name="flame" size={20} color="#fff" />
          <Text style={styles.streakBadgeText}>{streakData.current_streak}</Text>
        </View>
        <Text style={styles.streakBadgeLabel}>Current Streak</Text>
        <Text style={styles.streakExplanation}>
          Your streak increases by 1 when you accept a ride and decreases by 1 when you reject or cancel a ride.
        </Text>
      </View>
    );
  };

  const handleBackToDashboard = () => {
    // Navigate back to dashboard
    router.replace('/');
  };

  const handleCancelRide = async () => {
    try {
      // Confirm cancellation
      Alert.alert(
        "Cancel Ride",
        "Are you sure you want to cancel this ride? Your streak will decrease by 1.",
        [
          {
            text: "No, Keep Ride",
            style: "cancel"
          },
          {
            text: "Yes, Cancel Ride",
            onPress: async () => {
              // In a real app, you would get the current user ID
              const userId = 'mock-user-id';
              
              // Decrement streak
              const updatedData = await decrementStreak(userId);
              
              if (updatedData) {
                // Update local state
                setStreakData(updatedData);
                
                // Show streak notification
                Alert.alert(
                  'Streak Decreased',
                  `Your streak is now ${updatedData.current_streak}.`,
                  [{ text: 'OK' }]
                );
              }
              
              // Navigate back to dashboard
              router.replace('/');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error canceling ride:', error);
      Alert.alert('Error', 'Failed to cancel ride. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5722" />
        <Text style={styles.loadingText}>Loading ride details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
      </View>
      
      <Text style={styles.title}>Ride Accepted!</Text>
      
      <Text style={styles.message}>
        You have accepted the ride. Please reach the pickup location at the given time.
      </Text>
      
      {renderStreakBadge()}
      
      <View style={styles.detailsContainer}>
        <Text style={styles.detailLabel}>Pickup Location:</Text>
        <Text style={styles.detailValue}>{rideDetails.pickupLocation || 'Loading...'}</Text>
        
        <Text style={styles.detailLabel}>Destination:</Text>
        <Text style={styles.detailValue}>{rideDetails.destination || 'Loading...'}</Text>
        
        <Text style={styles.detailLabel}>Pickup Time:</Text>
        <Text style={styles.detailValue}>{rideDetails.pickupTime || 'Loading...'}</Text>
        
        {streakData && streakData.current_streak >= 3 && (
          <>
            <Text style={styles.bonusLabel}>Streak Bonus:</Text>
            <Text style={styles.bonusValue}>
              {streakData.current_streak >= 14 ? '15%' : 
               streakData.current_streak >= 7 ? '10%' : '5%'}
            </Text>
          </>
        )}
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={handleCancelRide}
        >
          <Text style={styles.cancelButtonText}>Cancel Ride</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={handleBackToDashboard}
        >
          <Text style={styles.buttonText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#555',
    lineHeight: 24,
  },
  streakBadgeContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF5722',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 5,
  },
  streakBadgeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  streakBadgeLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 10,
  },
  streakExplanation: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
    paddingHorizontal: 20,
    fontStyle: 'italic',
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 10,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  bonusLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF5722',
    marginTop: 15,
  },
  bonusValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF5722',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F44336',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RideAcceptedScreen; 