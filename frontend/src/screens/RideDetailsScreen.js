import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';

const RideDetailsScreen = ({ route, navigation }) => {
  const { ride } = route.params;
  const [rideStatus, setRideStatus] = useState('pending'); // pending, accepted, completed

  // Mock coordinates for the map
  const pickupCoords = { latitude: 12.9352, longitude: 77.6245 }; // Koramangala
  const dropoffCoords = { latitude: 12.9784, longitude: 77.6408 }; // Indiranagar

  const handleAcceptRide = () => {
    setRideStatus('accepted');
    // In a real app, you would make an API call to update the ride status
  };

  const handleCompleteRide = () => {
    setRideStatus('completed');
    // In a real app, you would make an API call to update the ride status
  };

  const handleCancelRide = () => {
    navigation.goBack();
    // In a real app, you would make an API call to cancel the ride
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: (pickupCoords.latitude + dropoffCoords.latitude) / 2,
            longitude: (pickupCoords.longitude + dropoffCoords.longitude) / 2,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker
            coordinate={pickupCoords}
            pinColor="#FF5722"
            title="Pickup"
            description={ride.pickup}
          />
          <Marker
            coordinate={dropoffCoords}
            pinColor="#4CAF50"
            title="Dropoff"
            description={ride.dropoff}
          />
          <Polyline
            coordinates={[pickupCoords, dropoffCoords]}
            strokeColor="#FF5722"
            strokeWidth={3}
          />
        </MapView>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.rideHeader}>
          <Text style={styles.rideId}>Ride #{ride.id}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {rideStatus === 'pending'
                ? 'Pending'
                : rideStatus === 'accepted'
                ? 'In Progress'
                : 'Completed'}
            </Text>
          </View>
        </View>

        <View style={styles.fareContainer}>
          <Text style={styles.fareLabel}>Fare</Text>
          <Text style={styles.fareValue}>{ride.fare}</Text>
          <View style={styles.multiplierBadge}>
            <Text style={styles.multiplierText}>{ride.dynamicMultiplier}x</Text>
          </View>
        </View>

        <View style={styles.locationContainer}>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={20} color="#FF5722" />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationLabel}>Pickup</Text>
              <Text style={styles.locationText}>{ride.pickup}</Text>
            </View>
          </View>
          <View style={styles.locationDivider} />
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={20} color="#4CAF50" />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationLabel}>Dropoff</Text>
              <Text style={styles.locationText}>{ride.dropoff}</Text>
            </View>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="speedometer-outline" size={16} color="#757575" />
            <Text style={styles.detailText}>{ride.distance}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color="#757575" />
            <Text style={styles.detailText}>{ride.estimatedTime}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {rideStatus === 'pending' && (
            <>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={handleAcceptRide}
              >
                <Text style={styles.acceptButtonText}>Accept Ride</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelRide}
              >
                <Text style={styles.cancelButtonText}>Decline</Text>
              </TouchableOpacity>
            </>
          )}

          {rideStatus === 'accepted' && (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleCompleteRide}
            >
              <Text style={styles.completeButtonText}>Complete Ride</Text>
            </TouchableOpacity>
          )}

          {rideStatus === 'completed' && (
            <View style={styles.completedContainer}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              <Text style={styles.completedText}>Ride Completed</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mapContainer: {
    height: 250,
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    padding: 20,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  rideId: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  statusText: {
    color: '#FF5722',
    fontWeight: '500',
  },
  fareContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  fareLabel: {
    fontSize: 16,
    color: '#757575',
    marginRight: 10,
  },
  fareValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 10,
  },
  multiplierBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  multiplierText: {
    color: '#FF5722',
    fontWeight: 'bold',
  },
  locationContainer: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  locationTextContainer: {
    marginLeft: 15,
  },
  locationLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 3,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '500',
  },
  locationDivider: {
    height: 20,
    width: 1,
    backgroundColor: '#E0E0E0',
    marginLeft: 10,
    marginBottom: 15,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  detailText: {
    marginLeft: 5,
    color: '#757575',
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF5722',
  },
  cancelButtonText: {
    color: '#FF5722',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completedContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  completedText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default RideDetailsScreen;