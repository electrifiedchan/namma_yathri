import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Heatmap, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../utils/config';

// Mock heatmap data
const mockHeatmapData = [
  { latitude: 12.9716, longitude: 77.5946, weight: 5 }, // Bangalore City Center
  { latitude: 12.9352, longitude: 77.6245, weight: 8 }, // Koramangala
  { latitude: 12.9698, longitude: 77.7499, weight: 6 }, // Whitefield
  { latitude: 13.0298, longitude: 77.5997, weight: 7 }, // Hebbal
  { latitude: 12.9063, longitude: 77.5857, weight: 4 }, // Jayanagar
  { latitude: 12.9784, longitude: 77.6408, weight: 9 }, // Indiranagar
  { latitude: 12.9254, longitude: 77.6964, weight: 3 }, // HSR Layout
  { latitude: 13.0206, longitude: 77.6479, weight: 5 }, // Banaswadi
  { latitude: 12.9767, longitude: 77.5713, weight: 6 }, // Malleshwaram
  { latitude: 12.8845, longitude: 77.6036, weight: 4 }  // BTM Layout
];

const HeatmapScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [heatmapData, setHeatmapData] = useState(mockHeatmapData);
  const [dynamicPricing, setDynamicPricing] = useState({});
  const [mapRegion, setMapRegion] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        setMapRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        console.error('Error getting location:', error);
        // Continue with default location
      }

      // Use mock data instead of trying to fetch from backend
      // fetchHeatmapData();
    })();
  }, []);

  const fetchHeatmapData = async () => {
    try {
      setIsLoading(true);
      // Comment out the actual API call to avoid network errors
      // const response = await axios.get(`${API_URL}/api/heatmap`);
      // setHeatmapData(response.data.heatmapData);
      // setDynamicPricing(response.data.dynamicPricing);
      
      // Simulate API response with mock data
      setTimeout(() => {
        // Randomize the weights a bit to simulate changing data
        const updatedData = mockHeatmapData.map(point => ({
          ...point,
          weight: Math.max(1, Math.min(10, point.weight + (Math.random() * 2 - 1)))
        }));
        setHeatmapData(updatedData);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching heatmap data:', error);
      setIsLoading(false);
      Alert.alert(
        "Network Error",
        "Could not connect to the server. Using offline data instead.",
        [{ text: "OK" }]
      );
    }
  };

  const renderDynamicPricingMarkers = () => {
    return heatmapData.map((point, index) => {
      // Calculate dynamic pricing multiplier based on demand (weight)
      const multiplier = (1 + (point.weight / 10)).toFixed(1);
      
      return (
        <Marker
          key={index}
          coordinate={{
            latitude: point.latitude,
            longitude: point.longitude,
          }}
        >
          <View style={styles.pricingMarker}>
            <Text style={styles.pricingText}>{multiplier}x</Text>
          </View>
        </Marker>
      );
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={mapRegion}
        showsUserLocation={true}
      >
        <Heatmap
          points={heatmapData}
          radius={50}
          opacity={0.8}
          gradient={{
            colors: ['#0000FF', '#00FFFF', '#00FF00', '#FFFF00', '#FF0000'],
            startPoints: [0, 0.25, 0.5, 0.75, 1],
            colorMapSize: 256,
          }}
        />
        {renderDynamicPricingMarkers()}
      </MapView>
      
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Demand Levels</Text>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#0000FF' }]} />
          <Text style={styles.legendText}>Low</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#00FF00' }]} />
          <Text style={styles.legendText}>Medium</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#FF0000' }]} />
          <Text style={styles.legendText}>High</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={[styles.refreshButton, isLoading && styles.refreshButtonDisabled]} 
        onPress={fetchHeatmapData}
        disabled={isLoading}
      >
        <Ionicons name="refresh" size={24} color="white" />
        {isLoading && <View style={styles.loadingIndicator} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  pricingMarker: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF5722',
  },
  pricingText: {
    fontWeight: 'bold',
    color: '#FF5722',
  },
  legend: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  legendTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  legendColor: {
    width: 20,
    height: 10,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
  },
  refreshButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#FF5722',
    padding: 10,
    borderRadius: 30,
    elevation: 5,
  },
  refreshButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loadingIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 30,
  },
});

export default HeatmapScreen;