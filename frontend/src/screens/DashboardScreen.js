import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getUserStreak, incrementStreak, decrementStreak, getMockUserStreak, clearStreakCache } from '@/src/services/supabaseService';

// Mock data for ride requests
const mockRides = [
  {
    id: '1',
    pickup: 'Koramangala',
    dropoff: 'Indiranagar',
    distance: '5.2 km',
    fare: '₹120',
    dynamicMultiplier: 1.5,
    estimatedTime: '15 min',
    pickupTime: '2:30 PM',
  },
  {
    id: '2',
    pickup: 'HSR Layout',
    dropoff: 'Whitefield',
    distance: '12.8 km',
    fare: '₹280',
    dynamicMultiplier: 1.2,
    estimatedTime: '35 min',
    pickupTime: '3:15 PM',
  },
  {
    id: '3',
    pickup: 'MG Road',
    dropoff: 'Electronic City',
    distance: '18.5 km',
    fare: '₹350',
    dynamicMultiplier: 1.3,
    estimatedTime: '45 min',
    pickupTime: '4:00 PM',
  },
];

const DashboardScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [rides, setRides] = useState(mockRides);
  const [streakCount, setStreakCount] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(1250);
  const [lastActiveDate, setLastActiveDate] = useState(null);
  const [longestStreak, setLongestStreak] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize streak data from Supabase on component mount or when returning to screen
  useEffect(() => {
    const fetchStreakData = async () => {
      try {
        setIsLoading(true);
        console.log('Dashboard: Fetching streak data, refreshKey:', refreshKey);
        console.log('Dashboard: Params:', params);
        
        // In a real app, you would get the current user ID
        const userId = 'mock-user-id';
        
        // Try to fetch from Supabase, fall back to mock data
        let streakData;
        try {
          // Don't force refresh here - use the cached data if available
          streakData = await getUserStreak(userId);
          if (!streakData) {
            streakData = getMockUserStreak();
          }
        } catch (error) {
          console.error('Error fetching streak data:', error);
          streakData = getMockUserStreak();
        }
        
        console.log('Dashboard: Got streak data:', streakData);
        
        // Set streak data
        setStreakCount(streakData.current_streak);
        setLongestStreak(streakData.longest_streak);
        setLastActiveDate(streakData.last_active_date);
      } catch (error) {
        console.error('Error in fetchStreakData:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStreakData();
  }, [refreshKey]); // Refresh when refreshKey changes

  // Function to handle ride acceptance and update streak
  const handleAcceptRide = async (ride) => {
    try {
      setIsLoading(true);
      // In a real app, you would get the current user ID
      const userId = 'mock-user-id';
      
      console.log('Dashboard: Accepting ride, incrementing streak');
      
      // Increment streak in Supabase
      const updatedData = await incrementStreak(userId);
      
      if (updatedData) {
        console.log('Dashboard: Streak updated:', updatedData);
        
        // Update local state
        setStreakCount(updatedData.current_streak);
        setLongestStreak(updatedData.longest_streak);
        setLastActiveDate(updatedData.last_active_date);
        
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
            pickupTime: ride.pickupTime,
            fare: ride.fare
          })
        }
      });
      
      // Remove the accepted ride from the list
      setRides(rides.filter(r => r.id !== ride.id));
      
      // Force refresh of streak data when returning to this screen
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error in handleAcceptRide:', error);
      Alert.alert('Error', 'Failed to accept ride. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle ride rejection and update streak
  const handleRejectRide = async (ride) => {
    try {
      setIsLoading(true);
      // In a real app, you would get the current user ID
      const userId = 'mock-user-id';
      
      console.log('Dashboard: Rejecting ride, decrementing streak');
      
      // Decrement streak in Supabase
      const updatedData = await decrementStreak(userId);
      
      if (updatedData) {
        console.log('Dashboard: Streak updated:', updatedData);
        
        // Update local state immediately
        setStreakCount(updatedData.current_streak);
        setLastActiveDate(updatedData.last_active_date);
        
        // Show streak notification
        Alert.alert(
          'Streak Decreased',
          `Your streak is now ${updatedData.current_streak}.`,
          [{ text: 'OK' }]
        );
      }
      
      // Remove the rejected ride from the list
      setRides(rides.filter(r => r.id !== ride.id));
      
      // Force refresh of streak data
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error in handleRejectRide:', error);
      Alert.alert('Error', 'Failed to reject ride. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to manually refresh streak data
  const refreshStreakData = async () => {
    try {
      setIsLoading(true);
      console.log('Dashboard: Manually refreshing streak data');
      
      // Clear the cache to force a refresh
      clearStreakCache();
      
      const userId = 'mock-user-id';
      const streakData = await getUserStreak(userId, true);
      
      if (streakData) {
        console.log('Dashboard: Got fresh streak data:', streakData);
        setStreakCount(streakData.current_streak);
        setLongestStreak(streakData.longest_streak);
        setLastActiveDate(streakData.last_active_date);
        
        Alert.alert(
          'Streak Updated',
          `Your current streak is ${streakData.current_streak}.`,
          [{ text: 'OK' }]
        );
      }
      
      // Force refresh
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error refreshing streak data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderRideItem = ({ item }) => (
    <TouchableOpacity
      style={styles.rideCard}
      onPress={() => router.push({
        pathname: '/RideDetails',
        params: { ride: JSON.stringify(item) }
      })}
    >
      <View style={styles.rideHeader}>
        <Text style={styles.rideId}>Ride #{item.id}</Text>
        <View style={styles.fareContainer}>
          <Text style={styles.fare}>{item.fare}</Text>
          <View style={styles.multiplierBadge}>
            <Text style={styles.multiplierText}>
              {item.dynamicMultiplier}x
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.locationContainer}>
        <View style={styles.locationRow}>
          <Ionicons name="location" size={20} color="#FF5722" />
          <Text style={styles.locationText}>{item.pickup}</Text>
        </View>
        <View style={styles.locationDivider} />
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={20} color="#4CAF50" />
          <Text style={styles.locationText}>{item.dropoff}</Text>
        </View>
      </View>

      <View style={styles.rideFooter}>
        <View style={styles.rideDetail}>
          <Ionicons name="speedometer-outline" size={16} color="#757575" />
          <Text style={styles.rideDetailText}>{item.distance}</Text>
        </View>
        <View style={styles.rideDetail}>
          <Ionicons name="time-outline" size={16} color="#757575" />
          <Text style={styles.rideDetailText}>{item.estimatedTime}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.rejectButton}
            onPress={() => handleRejectRide(item)}
            disabled={isLoading}
          >
            <Ionicons name="close" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.acceptButton}
            onPress={() => handleAcceptRide(item)}
            disabled={isLoading}
          >
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Namma Yatri</Text>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={refreshStreakData}
          disabled={isLoading}
        >
          <Ionicons name="refresh-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <TouchableOpacity 
          style={styles.statCard}
          onPress={refreshStreakData}
          disabled={isLoading}
        >
          <Text style={styles.statValue}>{streakCount}</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
        </TouchableOpacity>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>₹{totalEarnings}</Text>
          <Text style={styles.statLabel}>Today's Earnings</Text>
        </View>
      </View>

      <View style={styles.rideListHeader}>
        <Text style={styles.rideListTitle}>Available Rides</Text>
        <TouchableOpacity onPress={() => router.push('/explore')}>
          <Text style={styles.viewHeatmapText}>View Heatmap</Text>
        </TouchableOpacity>
      </View>

      {rides.length > 0 ? (
        <FlatList
          data={rides}
          renderItem={renderRideItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.rideList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyRidesContainer}>
          <Ionicons name="car-outline" size={60} color="#CCCCCC" />
          <Text style={styles.emptyRidesText}>No rides available at the moment</Text>
          <Text style={styles.emptyRidesSubtext}>Check back soon for new ride requests</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF5722',
  },
  notificationButton: {
    padding: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF5722',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#757575',
  },
  rideListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  rideListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewHeatmapText: {
    color: '#FF5722',
    fontWeight: '500',
  },
  rideList: {
    padding: 10,
  },
  rideCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  rideId: {
    fontSize: 16,
    fontWeight: '500',
  },
  fareContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fare: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 5,
  },
  multiplierBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  multiplierText: {
    color: '#FF5722',
    fontSize: 12,
    fontWeight: '500',
  },
  locationContainer: {
    marginBottom: 15,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  locationText: {
    marginLeft: 10,
    fontSize: 16,
  },
  locationDivider: {
    height: 15,
    width: 1,
    backgroundColor: '#E0E0E0',
    marginLeft: 10,
    marginVertical: 2,
  },
  rideFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rideDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  rideDetailText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#757575',
  },
  actionButtons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginLeft: 10,
  },
  rejectButton: {
    backgroundColor: '#F44336',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyRidesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  emptyRidesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#757575',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyRidesSubtext: {
    color: '#757575',
  },
});

export default DashboardScreen;