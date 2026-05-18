import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, location, phone, engineeringField, hourlyRate } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate initials
    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    const newUser = new User({
      role,
      name,
      email,
      password: hashedPassword,
      location: location || '',
      phone: phone || '',
      engineeringField: engineeringField || '',
      hourlyRate: hourlyRate || 0,
      avatar: {
        initials,
        bg: role === 'freelancer' ? 'rgba(37,99,235,0.22)' : 'rgba(139,92,246,0.2)',
        color: role === 'freelancer' ? '#60A5FA' : '#A78BFA'
      },
      rating: 0,
      reviews: 0,
      projects: 0,
      badge: 'New',
      badgeType: 'gray',
      available: role === 'freelancer',
      verified: false,
      joinedDate: new Date().toISOString().split('T')[0],
      bio: '',
      skills: [],
      services: [],
      education: [],
      portfolio: [],
      reviewsList: [],
      completedJobs: 0,
      totalEarned: '$0',
      postedJobs: 0,
      totalSpent: '$0'
    });

    await newUser.save();

    // Generate token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({ token, user: userResponse });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Email or password is incorrect' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email or password is incorrect' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ token, user: userResponse });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;