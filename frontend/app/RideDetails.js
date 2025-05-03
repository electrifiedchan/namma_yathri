import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { incrementStreak, decrementStreak, getUserStreak } from '@/src/services/supabaseService';

export default function RideDetails() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const ride = params.ride ? JSON.parse(params.ride) : {};
  const [currentStreak, setCurrentStreak] = useState(0);

  // Fetch current streak when component mounts
  useEffect(() => {
    const fetchCurrentStreak = async () => {
      try {
        const userId = 'mock-user-id';
        const streakData = await getUserStreak(userId);
        if (streakData) {
          setCurrentStreak(streakData.current_streak);
        }
      } catch (error) {
        console.error('Error fetching current streak:', error);
      }
    };

    fetchCurrentStreak();
  }, []);

  const handleAcceptRide = async () => {
    try {
      // In a real app, you would get the current user ID
      const userId = 'mock-user-id';
      
      // Increment streak
      const updatedData = await incrementStreak(userId);
      
      if (updatedData) {
        // Update local state
        setCurrentStreak(updatedData.current_streak);
        
        // Show streak notification
        Alert.alert(
          'Streak Increased!',
          `Your streak is now ${updatedData.current_streak}!`,
          [{ text: 'OK' }]
        );
      }
      
      // Navigate to the ride accepted screen
      router.push({
        pathname: '/RideAccepted',
        params: {
          rideDetails: JSON.stringify({
            id: ride.id,
            pickupLocation: ride.pickup,
            destination: ride.dropoff,
            pickupTime: ride.pickupTime || '2:30 PM',
            fare: ride.fare
          })
        }
      });
    } catch (error) {
      console.error('Error accepting ride:', error);
      Alert.alert('Error', 'Failed to accept ride. Please try again.');
    }
  };

  const handleRejectRide = async () => {
    try {
      // In a real app, you would get the current user ID
      const userId = 'mock-user-id';
      
      // Decrement streak
      const updatedData = await decrementStreak(userId);
      
      if (updatedData) {
        // Update local state
        setCurrentStreak(updatedData.current_streak);
        
        // Show streak notification
        Alert.alert(
          'Streak Decreased',
          `Your streak is now ${updatedData.current_streak}.`,
          [{ text: 'OK' }]
        );
      }
      
      // Navigate back to dashboard
      router.replace('/');
    } catch (error) {
      console.error('Error rejecting ride:', error);
      Alert.alert('Error', 'Failed to reject ride. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Ride #{ride.id}</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Route</Text>
          <View style={styles.locationContainer}>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={20} color="#FF5722" />
              <Text style={styles.locationText}>{ride.pickup}</Text>
            </View>
            <View style={styles.locationDivider} />
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={20} color="#4CAF50" />
              <Text style={styles.locationText}>{ride.dropoff}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailRow}>
            <Ionicons name="speedometer-outline" size={18} color="#757575" />
            <Text style={styles.detailLabel}>Distance:</Text>
            <Text style={styles.detailValue}>{ride.distance}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={18} color="#757575" />
            <Text style={styles.detailLabel}>Estimated Time:</Text>
            <Text style={styles.detailValue}>{ride.estimatedTime}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="cash-outline" size={18} color="#757575" />
            <Text style={styles.detailLabel}>Fare:</Text>
            <Text style={styles.detailValue}>{ride.fare}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="trending-up-outline" size={18} color="#FF5722" />
            <Text style={styles.detailLabel}>Dynamic Pricing:</Text>
            <Text style={styles.detailValue}>{ride.dynamicMultiplier}x</Text>
          </View>
        </View>
        
        <View style={styles.streakInfo}>
          <Ionicons name="flame" size={20} color="#FF5722" />
          <View style={styles.streakTextContainer}>
            <Text style={styles.streakText}>
              Current streak: {currentStreak}
            </Text>
            <Text style={styles.streakText}>
              Accepting this ride will increase your streak by 1.
            </Text>
            <Text style={styles.streakText}>
              Rejecting or canceling this ride will decrease your streak by 1.
            </Text>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.rejectButton}
            onPress={handleRejectRide}
          >
            <Text style={styles.rejectButtonText}>Reject</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.acceptButton}
            onPress={handleAcceptRide}
          >
            <Text style={styles.acceptButtonText}>Accept Ride</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#555',
  },
  locationContainer: {
    marginBottom: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 10,
    fontSize: 16,
  },
  locationDivider: {
    height: 20,
    width: 1,
    backgroundColor: '#E0E0E0',
    marginLeft: 10,
    marginVertical: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 15,
    marginLeft: 10,
    color: '#666',
    width: 120,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  streakInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  streakTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  streakText: {
    fontSize: 14,
    color: '#FF5722',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  acceptButton: {
    flex: 2,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginLeft: 10,
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#F44336',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 