const supabase = require('../config/supabase');

// Get all rides for a driver
exports.getDriverRides = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('rides')
      .select('*')
      .eq('driver_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single ride
exports.getRide = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('rides')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    // Check if the ride belongs to the authenticated driver
    if (data.driver_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Accept a ride
exports.acceptRide = async (req, res) => {
  try {
    const { data: ride, error: rideError } = await supabase
      .from('rides')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (rideError) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    // Check if the ride is already accepted
    if (ride.status !== 'pending') {
      return res.status(400).json({ message: 'Ride is not available for acceptance' });
    }

    // Update the ride status and assign to driver
    const { data, error } = await supabase
      .from('rides')
      .update({ 
        status: 'accepted', 
        driver_id: req.user.id,
        accepted_at: new Date()
      })
      .eq('id', req.params.id)
      .select();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    // Update driver's streak count
    const { data: driverData, error: driverError } = await supabase
      .from('drivers')
      .select('streak_count')
      .eq('id', req.user.id)
      .single();

    if (!driverError) {
      await supabase
        .from('drivers')
        .update({ 
          streak_count: driverData.streak_count + 1 
        })
        .eq('id', req.user.id);
    }

    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Complete a ride
exports.completeRide = async (req, res) => {
  try {
    const { data: ride, error: rideError } = await supabase
      .from('rides')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (rideError) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    // Check if the ride belongs to the authenticated driver
    if (ride.driver_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if the ride is in progress
    if (ride.status !== 'accepted') {
      return res.status(400).json({ message: 'Ride is not in progress' });
    }

    // Update the ride status
    const { data, error } = await supabase
      .from('rides')
      .update({ 
        status: 'completed', 
        completed_at: new Date()
      })
      .eq('id', req.params.id)
      .select();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    // Update driver's total earnings
    const { data: driverData, error: driverError } = await supabase
      .from('drivers')
      .select('total_earnings')
      .eq('id', req.user.id)
      .single();

    if (!driverError) {
      await supabase
        .from('drivers')
        .update({ 
          total_earnings: driverData.total_earnings + ride.fare 
        })
        .eq('id', req.user.id);
    }

    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};