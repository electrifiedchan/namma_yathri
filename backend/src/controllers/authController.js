const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

// Register a new driver
exports.register = async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('drivers')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in Supabase
    const { data, error } = await supabase
      .from('drivers')
      .insert([
        { 
          email, 
          password: hashedPassword, 
          name, 
          phone,
          created_at: new Date(),
          streak_count: 0,
          total_earnings: 0
        }
      ])
      .select();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: data[0].id, email: data[0].email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: data[0].id,
        email: data[0].email,
        name: data[0].name
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const { data: user, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('drivers')
      .select('id, email, name, phone, streak_count, total_earnings')
      .eq('id', req.user.id)
      .single();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};