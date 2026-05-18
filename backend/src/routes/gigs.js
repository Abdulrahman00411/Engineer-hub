import express from 'express';
import Gig from '../models/Gig.js';
import User from '../models/User.js';
import { auth, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all gigs with filters
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, maxPrice } = req.query;

    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (maxPrice) {
      query.startingAt = { $lte: Number(maxPrice) };
    }

    const gigs = await Gig.find(query).sort({ rating: -1 });
    res.json(gigs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching gigs' });
  }
});

// Get single gig
router.get('/:id', async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }
    res.json(gig);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching gig' });
  }
});

// Create gig (engineers only)
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'freelancer') {
      return res.status(403).json({ error: 'Only engineers can create gigs' });
    }

    const { title, category, icon, accent, startingAt, deliveryDays, description, tags, packages } = req.body;

    const gig = new Gig({
      engineerId: req.user.id,
      engineerName: user.name,
      initials: user.avatar?.initials || '',
      avatar: user.avatar || {},
      title,
      category,
      icon: icon || '',
      accent: accent || '#2563EB',
      startingAt,
      deliveryDays,
      rating: user.rating || 0,
      reviews: 0,
      description,
      tags: tags || [],
      packages: packages || []
    });

    await gig.save();
    res.status(201).json(gig);
  } catch (error) {
    console.error('Create gig error:', error);
    res.status(500).json({ error: 'Error creating gig' });
  }
});

// Update gig
router.put('/:id', auth, async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    if (gig.engineerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updates = req.body;
    Object.assign(gig, updates);
    await gig.save();

    res.json(gig);
  } catch (error) {
    res.status(500).json({ error: 'Error updating gig' });
  }
});

// Delete gig
router.delete('/:id', auth, async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    if (gig.engineerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await gig.deleteOne();
    res.json({ message: 'Gig deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting gig' });
  }
});

// Get engineer's gigs
router.get('/engineer/my-gigs', auth, async (req, res) => {
  try {
    const gigs = await Gig.find({ engineerId: req.user.id });
    res.json(gigs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching gigs' });
  }
});

// Order gig (create conversation)
router.post('/:id/order', auth, async (req, res) => {
  try {
    const { packageIndex } = req.body;
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    // This would typically create an order and start a conversation
    // For now, just acknowledge the order request
    res.json({
      message: 'Order request received',
      gig: gig,
      package: gig.packages[packageIndex],
      clientId: req.user.id,
      engineerId: gig.engineerId
    });
  } catch (error) {
    res.status(500).json({ error: 'Error processing order' });
  }
});

export default router;