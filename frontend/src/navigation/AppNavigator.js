import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// App Screens
import DashboardScreen from '../screens/DashboardScreen';
import HeatmapScreen from '../screens/HeatmapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RideDetailsScreen from '../screens/RideDetailsScreen';
import StreakScreen from '../screens/StreakScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const DashboardStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RideDetails" component={RideDetailsScreen} options={{ title: 'Ride Details' }} />
    </Stack.Navigator>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'DashboardTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Heatmap') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Streak') {
            iconName = focused ? 'flame' : 'flame-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF5722',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="DashboardTab" 
        component={DashboardStack} 
        options={{ 
          headerShown: false,
          title: 'Dashboard'
        }} 
      />
      <Tab.Screen name="Heatmap" component={HeatmapScreen} />
      <Tab.Screen name="Streak" component={StreakScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return <MainTabs />;
};

export default AppNavigator;