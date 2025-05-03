const express = require('express');
const router = express.Router();
const streakController = require('../controllers/streakController');
const auth = require('../middleware/auth');

// Get streak information
router.get('/', auth, streakController.getStreakInfo);

// Reset streak
router.post('/reset', auth, streakController.resetStreak);

// Update streak timestamp
router.post('/update-timestamp', auth, streakController.updateStreakTimestamp);

module.exports = router;