import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StreakScreen = () => {
  const [streakCount, setStreakCount] = useState(3);
  const [streakBonus, setStreakBonus] = useState(100);
  const [timeRemaining, setTimeRemaining] = useState(60 * 60); // 1 hour in seconds
  const [isActive, setIsActive] = useState(true);
  const [progress] = useState(new Animated.Value(0));

  // Mock streak history
  const streakHistory = [
    { date: '2023-11-01', count: 5, bonus: 200 },
    { date: '2023-10-31', count: 8, bonus: 300 },
    { date: '2023-10-30', count: 2, bonus: 0 },
    { date: '2023-10-29', count: 10, bonus: 500 },
    { date: '2023-10-28', count: 7, bonus: 200 },
  ];

  useEffect(() => {
    let interval = null;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: streakCount / 10, // Assuming 10 is the max streak
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [streakCount, progress]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const getStreakBonusText = () => {
    if (streakCount >= 10) return '₹500 bonus';
    if (streakCount >= 5) return '₹200 bonus';
    if (streakCount >= 3) return '₹100 bonus';
    return 'Keep going for bonus!';
  };

  const getNextMilestone = () => {
    if (streakCount < 3) return 3;
    if (streakCount < 5) return 5;
    if (streakCount < 10) return 10;
    return 10;
  };

  const renderStreakCircles = () => {
    const circles = [];
    const milestones = [3, 5, 10];

    for (let i = 1; i <= 10; i++) {
      const isMilestone = milestones.includes(i);
      const isCompleted = i <= streakCount;
      const isCurrent = i === streakCount;

      circles.push(
        <View key={i} style={styles.streakCircleContainer}>
          <View
            style={[
              styles.streakCircle,
              isMilestone && styles.milestoneCircle,
              isCompleted && styles.completedCircle,
              isCurrent && styles.currentCircle,
            ]}
          >
            <Text
              style={[
                styles.streakCircleText,
                isCompleted && styles.completedCircleText,
              ]}
            >
              {i}
            </Text>
          </View>
          {isMilestone && (
            <View style={styles.bonusBadge}>
              <Text style={styles.bonusBadgeText}>
                {i === 3 ? '₹100' : i === 5 ? '₹200' : '₹500'}
              </Text>
            </View>
          )}
        </View>
      );
    }

    return circles;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Streak</Text>
      </View>

      <View style={styles.streakInfoContainer}>
        <View style={styles.streakCountContainer}>
          <Text style={styles.streakCountLabel}>Current Streak</Text>
          <Text style={styles.streakCount}>{streakCount}</Text>
          <Text style={styles.streakBonusText}>{getStreakBonusText()}</Text>
        </View>

        {isActive && (
          <View style={styles.timerContainer}>
            <Text style={styles.timerLabel}>Time Remaining</Text>
            <Text style={styles.timer}>{formatTime(timeRemaining)}</Text>
            <Text style={styles.timerHint}>
              Complete a ride to keep your streak active!
            </Text>
          </View>
        )}
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressTitle}>Streak Progress</Text>
        <Text style={styles.progressSubtitle}>
          {streakCount < 10
            ? `${streakCount}/10 rides - Next milestone: ${getNextMilestone()} rides`
            : 'Maximum streak achieved!'}
        </Text>

        <View style={styles.streakTracker}>
          <View style={styles.streakLine} />
          <View style={styles.streakCirclesContainer}>
            {renderStreakCircles()}
          </View>
        </View>

        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Streak History</Text>
        {streakHistory.map((item, index) => (
          <View key={index} style={styles.historyItem}>
            <Text style={styles.historyDate}>{item.date}</Text>
            <View style={styles.historyDetails}>
              <Text style={styles.historyCount}>{item.count} rides</Text>
              <Text style={styles.historyBonus}>
                {item.bonus > 0 ? `₹${item.bonus} bonus` : 'No bonus'}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  streakInfoContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  streakCountContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: isActive ? 1 : 0,
    borderRightColor: '#f0f0f0',
  },
  streakCountLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 5,
  },
  streakCount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF5722',
    marginBottom: 5,
  },
  streakBonusText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  timerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 20,
  },
  timerLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 5,
  },
  timer: {
    fontSize: 28,
    fontWeight: 'bold',
    color: timeRemaining < 600 ? '#F44336' : '#FF5722', // Red if less than 10 minutes
    marginBottom: 5,
  },
  timerHint: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
  },
  progressContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  progressSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 20,
  },
  streakTracker: {
    position: 'relative',
    height: 80,
    marginBottom: 10,
  },
  streakLine: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#E0E0E0',
  },
  streakCirclesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  milestoneCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#FFC107',
  },
  completedCircle: {
    backgroundColor: '#FF5722',
  },
  currentCircle: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  streakCircleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#757575',
  },
  completedCircleText: {
    color: '#fff',
  },
  bonusBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bonusBadgeText: {
    color: '#FF5722',
    fontSize: 10,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#FF5722',
    borderRadius: 3,
  },
  historyContainer: {
    backgroundColor: '#fff',
    padding: 20,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyDate: {
    fontSize: 14,
    color: '#757575',
  },
  historyDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyCount: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 10,
  },
  historyBonus: {
    fontSize: 14,
    color: '#4CAF50',
  },
});

export default StreakScreen;