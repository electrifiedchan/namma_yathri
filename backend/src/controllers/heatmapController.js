const supabase = require('../config/supabase');

// Get heatmap data
exports.getHeatmapData = async (req, res) => {
  try {
    // In a real application, this would fetch data from a database or external API
    // For demonstration, we'll return mock data
    const heatmapData = [
      { lat: 12.9716, lng: 77.5946, weight: 5 }, // Bangalore City Center
      { lat: 12.9352, lng: 77.6245, weight: 8 }, // Koramangala
      { lat: 12.9698, lng: 77.7499, weight: 6 }, // Whitefield
      { lat: 13.0298, lng: 77.5997, weight: 7 }, // Hebbal
      { lat: 12.9063, lng: 77.5857, weight: 4 }, // Jayanagar
      { lat: 12.9784, lng: 77.6408, weight: 9 }, // Indiranagar
      { lat: 12.9254, lng: 77.6964, weight: 3 }, // HSR Layout
      { lat: 13.0206, lng: 77.6479, weight: 5 }, // Banaswadi
      { lat: 12.9767, lng: 77.5713, weight: 6 }, // Malleshwaram
      { lat: 12.8845, lng: 77.6036, weight: 4 }  // BTM Layout
    ];

    // Get dynamic pricing multipliers for each area
    const dynamicPricing = [
      { area: "City Center", multiplier: 1.2 },
      { area: "Koramangala", multiplier: 1.5 },
      { area: "Whitefield", multiplier: 1.3 },
      { area: "Hebbal", multiplier: 1.4 },
      { area: "Jayanagar", multiplier: 1.1 },
      { area: "Indiranagar", multiplier: 1.6 },
      { area: "HSR Layout", multiplier: 1.0 },
      { area: "Banaswadi", multiplier: 1.2 },
      { area: "Malleshwaram", multiplier: 1.3 },
      { area: "BTM Layout", multiplier: 1.1 }
    ];

    res.json({ heatmapData, dynamicPricing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get dynamic pricing for a specific location
exports.getDynamicPricing = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    // In a real application, this would calculate the dynamic pricing based on demand
    // For demonstration, we'll return a mock multiplier
    const multiplier = 1.0 + Math.random() * 0.8; // Random multiplier between 1.0 and 1.8
    
    res.json({ multiplier: parseFloat(multiplier.toFixed(2)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};