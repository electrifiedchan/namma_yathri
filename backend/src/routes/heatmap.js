const express = require('express');
const router = express.Router();
const heatmapController = require('../controllers/heatmapController');
const auth = require('../middleware/auth');

// Get heatmap data
router.get('/', auth, heatmapController.getHeatmapData);

// Get dynamic pricing for a specific location
router.get('/pricing', auth, heatmapController.getDynamicPricing);

module.exports = router;