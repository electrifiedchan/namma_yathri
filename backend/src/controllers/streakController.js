const supabase = require('../config/supabase');

// Get streak information for the current driver
exports.getStreakInfo = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .select('streak_count, streak_last_updated')
      .eq('id', req.user.id)
      .single();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    // Calculate streak bonus
    let streakBonus = 0;
    if (data.streak_count >= 10) {
      streakBonus = 500; // ₹500 bonus for 10+ streak
    } else if (data.streak_count >= 5) {
      streakBonus = 200; // ₹200 bonus for 5+ streak
    } else if (data.streak_count >= 3) {
      streakBonus = 100; // ₹100 bonus for 3+ streak
    }

    // Check if streak is still active (within 2 hours of last update)
    const lastUpdated = new Date(data.streak_last_updated || 0);
    const now = new Date();
    const timeDiff = now - lastUpdated; // difference in milliseconds
    const isActive = timeDiff < 2 * 60 * 60 * 1000; // 2 hours in milliseconds

    res.json({
      streakCount: data.streak_count,
      streakBonus,
      isActive,
      timeRemaining: isActive ? 2 * 60 * 60 * 1000 - timeDiff : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset streak for the current driver
exports.resetStreak = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .update({ 
        streak_count: 0,
        streak_last_updated: new Date()
      })
      .eq('id', req.user.id)
      .select();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    res.json({ message: 'Streak reset successfully', streakCount: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update streak timestamp (to keep streak active)
exports.updateStreakTimestamp = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .update({ 
        streak_last_updated: new Date()
      })
      .eq('id', req.user.id)
      .select();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    res.json({ message: 'Streak timestamp updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};