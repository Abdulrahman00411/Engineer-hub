import express from 'express';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all engineers with filters
router.get('/', async (req, res) => {
  try {
    const { category, available, search, sort } = req.query;

    let query = { role: 'freelancer' };

    if (category && category !== 'All') {
      query.engineeringField = category;
    }

    if (available === 'true') {
      query.available = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = {};
    switch (sort) {
      case 'rate_low':
        sortOption = { hourlyRate: 1 };
        break;
      case 'rate_high':
        sortOption = { hourlyRate: -1 };
        break;
      default:
        sortOption = { rating: -1 };
    }

    const engineers = await User.find(query).sort(sortOption);
    res.json(engineers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching engineers' });
  }
});

// Get single engineer
router.get('/:id', async (req, res) => {
  try {
    const engineer = await User.findById(req.params.id);
    if (!engineer || engineer.role !== 'freelancer') {
      return res.status(404).json({ error: 'Engineer not found' });
    }
    res.json(engineer);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching engineer' });
  }
});

// Update engineer profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password;
    delete updates.email;
    delete updates.role;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error updating profile' });
  }
});

// Get engineer by category
router.get('/category/:category', async (req, res) => {
  try {
    const engineers = await User.find({
      role: 'freelancer',
      engineeringField: req.params.category
    }).sort({ rating: -1 });
    res.json(engineers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching engineers' });
  }
});

export default router;