import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://raizkiusxobcwvgvvugd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhaXpraXVzeG9iY3d2Z3Z2dWdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5NDQ2NDIsImV4cCI6MjA1NzUyMDY0Mn0.Ss-S50Ixe6HCscTHJ_cSocGD--OC9WMQVnuhynBY4qI';
const supabase = createClient(supabaseUrl, supabaseKey);

// Cache for streak data to ensure consistent values across components
let streakCache = null;

// Default streak data (used only when no cache exists)
const defaultStreakData = {
  user_id: 'mock-user-id',
  current_streak: 3,
  longest_streak: 7,
  streak_start_date: '2023-06-13',
  last_active_date: '2023-06-15',
  updated_at: '2023-06-15T12:00:00Z'
};

// User Streak Functions
export const getUserStreak = async (userId, forceRefresh = false) => {
  try {
    // If we have cached data and no force refresh, return it
    if (streakCache && !forceRefresh) {
      console.log('Returning cached streak data:', streakCache);
      return { ...streakCache };
    }
    
    console.log('Getting fresh streak data');
    
    // For development, return mock data to avoid API calls
    // If we have a cache, use it as the base for the mock data
    if (streakCache) {
      console.log('Using cached data as base for mock data');
      return { ...streakCache };
    }
    
    // Otherwise, use the default streak data
    console.log('Using default streak data');
    streakCache = { ...defaultStreakData };
    console.log('Updated streak cache:', streakCache);
    return { ...streakCache };
    
    // When you have your Supabase set up, uncomment this code:
    /*
    const { data, error } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    streakCache = data;
    return { ...data };
    */
  } catch (error) {
    console.error('Error fetching user streak:', error);
    if (streakCache) {
      return { ...streakCache };
    }
    streakCache = { ...defaultStreakData };
    return { ...streakCache };
  }
};

export const incrementStreak = async (userId) => {
  try {
    console.log('Incrementing streak for user:', userId);
    
    // Get current streak data with force refresh
    const currentData = await getUserStreak(userId, true);
    console.log('Current streak data before increment:', currentData);
    
    // Increment streak count
    const newStreakCount = currentData.current_streak + 1;
    
    // Update longest streak if needed
    const newLongestStreak = Math.max(currentData.longest_streak, newStreakCount);
    
    // Prepare updated data
    const updatedData = {
      ...currentData,
      current_streak: newStreakCount,
      longest_streak: newLongestStreak,
      last_active_date: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString()
    };
    
    // Update cache immediately
    streakCache = { ...updatedData };
    console.log('Updated streak cache after increment:', streakCache);
    
    // For development, just return updated data
    return { ...updatedData };
    
    // When you have your Supabase set up, uncomment this code:
    /*
    const { data, error } = await supabase
      .from('user_streaks')
      .upsert(updatedData)
      .select();
    
    if (error) throw error;
    streakCache = data;
    return { ...data };
    */
  } catch (error) {
    console.error('Error incrementing streak:', error);
    return null;
  }
};

export const decrementStreak = async (userId) => {
  try {
    console.log('Decrementing streak for user:', userId);
    
    // Get current streak data with force refresh
    const currentData = await getUserStreak(userId, true);
    console.log('Current streak data before decrement:', currentData);
    
    // Decrement streak count, but don't go below 0
    const newStreakCount = Math.max(0, currentData.current_streak - 1);
    
    // Prepare updated data
    const updatedData = {
      ...currentData,
      current_streak: newStreakCount,
      last_active_date: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString()
    };
    
    // Update cache immediately
    streakCache = { ...updatedData };
    console.log('Updated streak cache after decrement:', streakCache);
    
    // For development, just return updated data
    return { ...updatedData };
    
    // When you have your Supabase set up, uncomment this code:
    /*
    const { data, error } = await supabase
      .from('user_streaks')
      .upsert(updatedData)
      .select();
    
    if (error) throw error;
    streakCache = data;
    return { ...data };
    */
  } catch (error) {
    console.error('Error decrementing streak:', error);
    return null;
  }
};

// Clear streak cache (useful for testing or when logging out)
export const clearStreakCache = () => {
  console.log('Clearing streak cache');
  streakCache = null;
};

// Leaderboard Functions
export const getLeaderboard = async (limit = 10) => {
  try {
    // For development, return mock data
    return getMockLeaderboard();
    
    // When you have your Supabase set up, uncomment this code:
    /*
    const { data, error } = await supabase
      .from('user_streaks')
      .select(`
        user_id,
        current_streak,
        longest_streak,
        users:user_id (
          name,
          profile_image
        )
      `)
      .order('current_streak', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
    */
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return getMockLeaderboard();
  }
};

// Mock data for development (when Supabase is not connected)
export const getMockUserStreak = () => {
  // If we have cached data, use that as the base
  if (streakCache) {
    console.log('Using cached data as base for mock data');
    return { ...streakCache };
  }
  
  console.log('Creating new mock streak data');
  return { ...defaultStreakData };
};

export const getMockLeaderboard = () => {
  // Update the mock user's streak to match the current streak
  const currentStreak = streakCache ? streakCache.current_streak : 3;
  const longestStreak = streakCache ? streakCache.longest_streak : 7;
  
  const leaderboard = [
    {
      user_id: 'user-1',
      current_streak: 15,
      longest_streak: 21,
      users: { name: 'Rahul Singh', profile_image: null }
    },
    {
      user_id: 'user-2',
      current_streak: 12,
      longest_streak: 14,
      users: { name: 'Priya Sharma', profile_image: null }
    },
    {
      user_id: 'user-3',
      current_streak: 10,
      longest_streak: 18,
      users: { name: 'Amit Kumar', profile_image: null }
    },
    {
      user_id: 'user-4',
      current_streak: 9,
      longest_streak: 12,
      users: { name: 'Deepak Patel', profile_image: null }
    },
    {
      user_id: 'user-5',
      current_streak: 8,
      longest_streak: 10,
      users: { name: 'Neha Gupta', profile_image: null }
    },
    {
      user_id: 'user-6',
      current_streak: 7,
      longest_streak: 15,
      users: { name: 'Vikram Reddy', profile_image: null }
    },
    {
      user_id: 'user-7',
      current_streak: 6,
      longest_streak: 9,
      users: { name: 'Ananya Desai', profile_image: null }
    },
    {
      user_id: 'user-8',
      current_streak: 5,
      longest_streak: 8,
      users: { name: 'Rajesh Khanna', profile_image: null }
    },
    {
      user_id: 'user-9',
      current_streak: 4,
      longest_streak: 11,
      users: { name: 'Sunita Verma', profile_image: null }
    },
    {
      user_id: 'mock-user-id',
      current_streak: currentStreak,
      longest_streak: longestStreak,
      users: { name: 'Kiran Rao', profile_image: null }
    }
  ];
  
  return leaderboard;
}; 