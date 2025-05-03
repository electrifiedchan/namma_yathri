import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationSharing, setLocationSharing] = useState(true);

  // Mock user data
  const user = {
    name: 'Rahul Kumar',
    email: 'rahul.kumar@example.com',
    phone: '+91 98765 43210',
    rating: 4.8,
    totalRides: 342,
    totalEarnings: 45680,
    memberSince: 'June 2022',
    vehicle: {
      model: 'Honda Activa',
      number: 'KA 01 AB 1234',
      type: 'Two Wheeler',
    },
  };

  const toggleSwitch = (setting) => {
    switch (setting) {
      case 'notifications':
        setNotifications(!notifications);
        break;
      case 'darkMode':
        setDarkMode(!darkMode);
        break;
      case 'locationSharing':
        setLocationSharing(!locationSharing);
        break;
      default:
        break;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editImageButton}>
            <Ionicons name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFC107" />
          <Text style={styles.ratingText}>{user.rating}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.totalRides}</Text>
          <Text style={styles.statLabel}>Total Rides</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>₹{user.totalEarnings}</Text>
          <Text style={styles.statLabel}>Total Earnings</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.infoItem}>
          <Ionicons name="mail-outline" size={20} color="#757575" style={styles.infoIcon} />
          <View>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={20} color="#FF5722" />
          </TouchableOpacity>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="call-outline" size={20} color="#757575" style={styles.infoIcon} />
          <View>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{user.phone}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={20} color="#FF5722" />
          </TouchableOpacity>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="calendar-outline" size={20} color="#757575" style={styles.infoIcon} />
          <View>
            <Text style={styles.infoLabel}>Member Since</Text>
            <Text style={styles.infoValue}>{user.memberSince}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vehicle Information</Text>
        <View style={styles.infoItem}>
          <Ionicons name="car-outline" size={20} color="#757575" style={styles.infoIcon} />
          <View>
            <Text style={styles.infoLabel}>Vehicle Model</Text>
            <Text style={styles.infoValue}>{user.vehicle.model}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={20} color="#FF5722" />
          </TouchableOpacity>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="clipboard-outline" size={20} color="#757575" style={styles.infoIcon} />
          <View>
            <Text style={styles.infoLabel}>Vehicle Number</Text>
            <Text style={styles.infoValue}>{user.vehicle.number}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={20} color="#FF5722" />
          </TouchableOpacity>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="options-outline" size={20} color="#757575" style={styles.infoIcon} />
          <View>
            <Text style={styles.infoLabel}>Vehicle Type</Text>
            <Text style={styles.infoValue}>{user.vehicle.type}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={20} color="#FF5722" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingItem}>
          <Ionicons name="notifications-outline" size={20} color="#757575" style={styles.settingIcon} />
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Text style={styles.settingDescription}>Receive ride alerts and updates</Text>
          </View>
          <Switch
            trackColor={{ false: '#E0E0E0', true: '#FFCCBC' }}
            thumbColor={notifications ? '#FF5722' : '#f4f3f4'}
            onValueChange={() => toggleSwitch('notifications')}
            value={notifications}
          />
        </View>
        <View style={styles.settingItem}>
          <Ionicons name="moon-outline" size={20} color="#757575" style={styles.settingIcon} />
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Text style={styles.settingDescription}>Switch to dark theme</Text>
          </View>
          <Switch
            trackColor={{ false: '#E0E0E0', true: '#FFCCBC' }}
            thumbColor={darkMode ? '#FF5722' : '#f4f3f4'}
            onValueChange={() => toggleSwitch('darkMode')}
            value={darkMode}
          />
        </View>
        <View style={styles.settingItem}>
          <Ionicons name="location-outline" size={20} color="#757575" style={styles.settingIcon} />
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Location Sharing</Text>
            <Text style={styles.settingDescription}>Share your location with customers</Text>
          </View>
          <Switch
            trackColor={{ false: '#E0E0E0', true: '#FFCCBC' }}
            thumbColor={locationSharing ? '#FF5722' : '#f4f3f4'}
            onValueChange={() => toggleSwitch('locationSharing')}
            value={locationSharing}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={20} color="#fff" style={styles.logoutIcon} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF5722',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: 15,
    marginBottom: 15,
    padding: 15,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF5722',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#757575',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 15,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoIcon: {
    marginRight: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#757575',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  editButton: {
    marginLeft: 'auto',
    padding: 5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingIcon: {
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 3,
  },
  settingDescription: {
    fontSize: 14,
    color: '#757575',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FF5722',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;