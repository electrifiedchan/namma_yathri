const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Namma Yatri Driver Productivity API is running');
});

// Import routes
const authRoutes = require('./routes/auth');
const rideRoutes = require('./routes/rides');
const streakRoutes = require('./routes/streaks');
const heatmapRoutes = require('./routes/heatmap');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/streaks', streakRoutes);
app.use('/api/heatmap', heatmapRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});