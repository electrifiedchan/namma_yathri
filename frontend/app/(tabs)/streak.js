import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { getUserStreak, getLeaderboard, getMockUserStreak, getMockLeaderboard, clearStreakCache } from '@/src/services/supabaseService';

function StreakScreen() {
  const params = useLocalSearchParams();
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [lastActiveDate, setLastActiveDate] = useState(null);
  const [streakHistory, setStreakHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('streak'); // 'streak' or 'leaderboard'
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch streak data and leaderboard from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('StreakScreen: Fetching data, refreshKey:', refreshKey);
        console.log('StreakScreen: Params:', params);
        
        // If we have a streakUpdated param, clear the cache to force a refresh
        if (params.streakUpdated) {
          console.log('StreakScreen: Clearing streak cache due to streakUpdated param');
          clearStreakCache();
        }
        
        // In a real app, you would get the current user ID
        const userId = 'mock-user-id';
        
        // Force refresh if we have a streakUpdated param
        const forceRefresh = params.streakUpdated ? true : false;
        
        // Try to fetch from Supabase, fall back to mock data
        let streakData;
        try {
          streakData = await getUserStreak(userId, forceRefresh);
          if (!streakData) {
            streakData = getMockUserStreak();
          }
        } catch (error) {
          console.error('Error fetching streak data:', error);
          streakData = getMockUserStreak();
        }
        
        console.log('StreakScreen: Got streak data:', streakData);
        
        // Set streak data
        setCurrentStreak(streakData.current_streak);
        setLongestStreak(streakData.longest_streak);
        setLastActiveDate(streakData.last_active_date);
        
        // Generate streak history (in a real app, this would come from Supabase)
        const history = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          history.push({
            date: date.toISOString().split('T')[0],
            rides: Math.floor(Math.random() * 6) + 1,
            earnings: `₹${(Math.floor(Math.random() * 600) + 200)}`,
            streakChange: Math.random() > 0.3 ? '+1' : '-1' // Randomly generate streak changes
          });
        }
        setStreakHistory(history);
        
        // Fetch leaderboard
        let leaderboardData;
        try {
          leaderboardData = await getLeaderboard(10);
          if (!leaderboardData || leaderboardData.length === 0) {
            leaderboardData = getMockLeaderboard();
          }
        } catch (error) {
          console.error('Error fetching leaderboard:', error);
          leaderboardData = getMockLeaderboard();
        }
        
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error('Error in fetchData:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshKey, params.streakUpdated]);

  // Function to manually refresh streak data
  const refreshStreakData = async () => {
    try {
      setLoading(true);
      console.log('StreakScreen: Manually refreshing streak data');
      
      // Clear the cache to force a refresh
      clearStreakCache();
      
      const userId = 'mock-user-id';
      const streakData = await getUserStreak(userId, true);
      
      if (streakData) {
        console.log('StreakScreen: Got fresh streak data:', streakData);
        setCurrentStreak(streakData.current_streak);
        setLongestStreak(streakData.longest_streak);
        setLastActiveDate(streakData.last_active_date);
        
        // Force refresh of all data
        setRefreshKey(prev => prev + 1);
        
        Alert.alert(
          'Streak Updated',
          `Your current streak is ${streakData.current_streak}.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error refreshing streak data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate streak circles for visualization
  const renderStreakCircles = () => {
    const circles = [];
    for (let i = 0; i < 7; i++) {
      const isActive = i < currentStreak;
      circles.push(
        <View key={i} style={styles.streakCircleContainer}>
          <View style={[styles.streakCircle, isActive && styles.activeStreakCircle]}>
            {isActive && <Ionicons name="checkmark" size={20} color="#fff" />}
          </View>
          <Text style={styles.streakDay}>Level {i + 1}</Text>
        </View>
      );
    }
    return circles;
  };

  // Render leaderboard item
  const renderLeaderboardItem = (item, index) => {
    const isCurrentUser = item.user_id === 'mock-user-id'; // In a real app, compare with actual user ID
    
    return (
      <View 
        key={item.user_id} 
        style={[
          styles.leaderboardItem, 
          isCurrentUser && styles.currentUserItem
        ]}
      >
        <View style={styles.rankContainer}>
          <Text style={styles.rankText}>{index + 1}</Text>
        </View>
        
        <View style={styles.userImageContainer}>
          {item.users.profile_image ? (
            <Image 
              source={{ uri: item.users.profile_image }} 
              style={styles.userImage} 
            />
          ) : (
            <View style={styles.userImagePlaceholder}>
              <Text style={styles.userInitial}>
                {item.users.name.charAt(0)}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {item.users.name} {isCurrentUser && '(You)'}
          </Text>
          <Text style={styles.userStreak}>{item.current_streak} streak points</Text>
        </View>
        
        <View style={styles.streakBadge}>
          <Ionicons name="flame" size={16} color="#FF5722" />
          <Text style={styles.streakBadgeText}>{item.longest_streak}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5722" />
        <Text style={styles.loadingText}>Loading streak data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Streak</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={refreshStreakData}
          disabled={loading}
        >
          <Ionicons name="refresh-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'streak' && styles.activeTab]} 
          onPress={() => setActiveTab('streak')}
        >
          <Ionicons 
            name="flame" 
            size={20} 
            color={activeTab === 'streak' ? '#FF5722' : '#757575'} 
          />
          <Text style={[styles.tabText, activeTab === 'streak' && styles.activeTabText]}>
            My Streak
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'leaderboard' && styles.activeTab]} 
          onPress={() => setActiveTab('leaderboard')}
        >
          <Ionicons 
            name="trophy" 
            size={20} 
            color={activeTab === 'leaderboard' ? '#FF5722' : '#757575'} 
          />
          <Text style={[styles.tabText, activeTab === 'leaderboard' && styles.activeTabText]}>
            Leaderboard
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {activeTab === 'streak' ? (
          <>
            <View style={styles.streakCard}>
              <View style={styles.streakInfo}>
                <View style={styles.streakMetric}>
                  <Text style={styles.streakCount}>{currentStreak}</Text>
                  <Text style={styles.streakLabel}>Current Streak</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.streakMetric}>
                  <Text style={styles.streakCount}>{longestStreak}</Text>
                  <Text style={styles.streakLabel}>Longest Streak</Text>
                </View>
              </View>

              <View style={styles.streakExplanation}>
                <Ionicons name="information-circle-outline" size={20} color="#757575" />
                <Text style={styles.streakExplanationText}>
                  Your streak increases by 1 when you accept a ride and decreases by 1 when you reject or cancel a ride.
                </Text>
              </View>

              <View style={styles.streakVisualization}>
                {renderStreakCircles()}
              </View>
            </View>

            <View style={styles.rewardsCard}>
              <Text style={styles.sectionTitle}>Streak Rewards</Text>
              <View style={styles.rewardItem}>
                <View style={styles.rewardBadge}>
                  <Text style={styles.rewardBadgeText}>3</Text>
                </View>
                <View style={styles.rewardInfo}>
                  <Text style={styles.rewardTitle}>Streak Level 3</Text>
                  <Text style={styles.rewardDescription}>5% bonus on all fares</Text>
                </View>
                <View style={[styles.rewardStatus, currentStreak >= 3 && styles.rewardUnlocked]}>
                  <Text style={styles.rewardStatusText}>
                    {currentStreak >= 3 ? 'Unlocked' : 'Locked'}
                  </Text>
                </View>
              </View>

              <View style={styles.rewardItem}>
                <View style={styles.rewardBadge}>
                  <Text style={styles.rewardBadgeText}>7</Text>
                </View>
                <View style={styles.rewardInfo}>
                  <Text style={styles.rewardTitle}>Streak Level 7</Text>
                  <Text style={styles.rewardDescription}>10% bonus on all fares</Text>
                </View>
                <View style={[styles.rewardStatus, currentStreak >= 7 && styles.rewardUnlocked]}>
                  <Text style={styles.rewardStatusText}>
                    {currentStreak >= 7 ? 'Unlocked' : 'Locked'}
                  </Text>
                </View>
              </View>

              <View style={styles.rewardItem}>
                <View style={styles.rewardBadge}>
                  <Text style={styles.rewardBadgeText}>14</Text>
                </View>
                <View style={styles.rewardInfo}>
                  <Text style={styles.rewardTitle}>Streak Level 14</Text>
                  <Text style={styles.rewardDescription}>15% bonus + priority rides</Text>
                </View>
                <View style={[styles.rewardStatus, currentStreak >= 14 && styles.rewardUnlocked]}>
                  <Text style={styles.rewardStatusText}>
                    {currentStreak >= 14 ? 'Unlocked' : 'Locked'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.historyCard}>
              <Text style={styles.sectionTitle}>Activity History</Text>
              {streakHistory.map((item, index) => (
                <View key={index} style={styles.historyItem}>
                  <Text style={styles.historyDate}>{item.date}</Text>
                  <View style={styles.historyDetails}>
                    <View style={styles.historyMetric}>
                      <Ionicons name="car-outline" size={16} color="#757575" />
                      <Text style={styles.historyText}>{item.rides} rides</Text>
                    </View>
                    <View style={styles.historyMetric}>
                      <Ionicons name="cash-outline" size={16} color="#757575" />
                      <Text style={styles.historyText}>{item.earnings}</Text>
                    </View>
                    <View style={styles.historyMetric}>
                      <Ionicons 
                        name={item.streakChange.startsWith('+') ? "arrow-up" : "arrow-down"} 
                        size={16} 
                        color={item.streakChange.startsWith('+') ? "#4CAF50" : "#F44336"} 
                      />
                      <Text 
                        style={[
                          styles.historyText, 
                          {color: item.streakChange.startsWith('+') ? "#4CAF50" : "#F44336"}
                        ]}
                      >
                        {item.streakChange}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.leaderboardCard}>
            <Text style={styles.leaderboardTitle}>Top Drivers</Text>
            <Text style={styles.leaderboardSubtitle}>
              Drivers with the highest streak points
            </Text>
            
            <View style={styles.leaderboardList}>
              {leaderboard.map((item, index) => renderLeaderboardItem(item, index))}
            </View>
            
            <View style={styles.leaderboardFooter}>
              <Text style={styles.leaderboardFooterText}>
                Accept more rides to increase your streak and climb the leaderboard!
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    backgroundColor: '#FF5722',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  refreshButton: {
    padding: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF5722',
  },
  tabText: {
    fontSize: 16,
    marginLeft: 5,
    color: '#757575',
  },
  activeTabText: {
    color: '#FF5722',
    fontWeight: '500',
  },
  scrollContainer: {
    flex: 1,
  },
  streakCard: {
    margin: 15,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  streakInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  streakMetric: {
    alignItems: 'center',
  },
  streakCount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF5722',
  },
  streakLabel: {
    fontSize: 14,
    color: '#757575',
    marginTop: 5,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E0E0E0',
  },
  streakExplanation: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  streakExplanationText: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 10,
    flex: 1,
  },
  streakVisualization: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  streakCircleContainer: {
    alignItems: 'center',
  },
  streakCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  activeStreakCircle: {
    backgroundColor: '#4CAF50',
  },
  streakDay: {
    fontSize: 12,
    color: '#757575',
  },
  rewardsCard: {
    margin: 15,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  rewardBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF9800',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rewardBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  rewardDescription: {
    fontSize: 14,
    color: '#757575',
  },
  rewardStatus: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 15,
  },
  rewardUnlocked: {
    backgroundColor: '#4CAF50',
  },
  rewardStatusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
  historyCard: {
    margin: 15,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 30,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  historyDate: {
    fontSize: 14,
    color: '#333',
  },
  historyDetails: {
    flexDirection: 'row',
  },
  historyMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  historyText: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 5,
  },
  // Leaderboard styles
  leaderboardCard: {
    margin: 15,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 30,
  },
  leaderboardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  leaderboardSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 20,
  },
  leaderboardList: {
    marginBottom: 15,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  currentUserItem: {
    backgroundColor: '#FFF3E0',
  },
  rankContainer: {
    width: 30,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userImageContainer: {
    marginRight: 15,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#757575',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  userStreak: {
    fontSize: 14,
    color: '#757575',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakBadgeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF5722',
    marginLeft: 3,
  },
  leaderboardFooter: {
    alignItems: 'center',
    marginTop: 10,
  },
  leaderboardFooterText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },
});

export default StreakScreen; 