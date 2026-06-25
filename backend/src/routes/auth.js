import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';

const router = express.Router();

const userSelectFields = {
  id: true,
  role: true,
  name: true,
  email: true,
  phone: true,
  location: true,
  engineeringField: true,
  hourlyRate: true,
  avatar: true,
  rating: true,
  reviews: true,
  projects: true,
  badge: true,
  badgeType: true,
  available: true,
  verified: true,
  joinedDate: true,
  bio: true,
  skills: true,
  services: true,
  education: true,
  portfolio: true,
  reviewsList: true,
  completedJobs: true,
  totalEarned: true,
  postedJobs: true,
  totalSpent: true,
  createdAt: true,
  updatedAt: true
};

// Helper to parse JSON fields
const parseUserResponse = (user) => {
  const { password, ...response } = user;
  try {
    if (response.avatar && typeof response.avatar === 'string') {
      response.avatar = JSON.parse(response.avatar);
    }
    if (response.education && typeof response.education === 'string') {
      response.education = JSON.parse(response.education);
    }
    if (response.portfolio && typeof response.portfolio === 'string') {
      response.portfolio = JSON.parse(response.portfolio);
    }
    if (response.reviewsList && typeof response.reviewsList === 'string') {
      response.reviewsList = JSON.parse(response.reviewsList);
    }
  } catch (e) {
    // Keep original values if parsing fails
  }
  return response;
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, location, phone, engineeringField, hourlyRate } = req.body;

    // Input validation
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    if (!role || !['freelancer', 'client'].includes(role)) {
      return res.status(400).json({ error: 'Role must be freelancer or client' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate initials
    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    const newUser = await prisma.user.create({
      data: {
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
      }
    });

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const userResponse = parseUserResponse(newUser);

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

    // Input validation
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Email or password is incorrect' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email or password is incorrect' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const userResponse = parseUserResponse(user);

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
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: userSelectFields
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;