import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import RideAcceptedScreen from '@/src/screens/RideAcceptedScreen';

export default function RideAccepted() {
  const params = useLocalSearchParams();
  const rideDetails = params.rideDetails ? JSON.parse(params.rideDetails) : {};
  
  return <RideAcceptedScreen route={{ params: { rideDetails } }} />;
} 