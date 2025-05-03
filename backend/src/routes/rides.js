const express = require('express');
const router = express.Router();
const rideController = require('../controllers/rideController');
const auth = require('../middleware/auth');

// Get all rides for a driver
router.get('/', auth, rideController.getDriverRides);

// Get a single ride
router.get('/:id', auth, rideController.getRide);

// Accept a ride
router.put('/:id/accept', auth, rideController.acceptRide);

// Complete a ride
router.put('/:id/complete', auth, rideController.completeRide);

module.exports = router;