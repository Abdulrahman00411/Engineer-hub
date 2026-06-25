import express from 'express';
import { prisma } from '../config/database.js';
import { auth, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Helper to parse JSON fields
const parseGigResponse = (gig) => {
  if (!gig) return gig;
  const response = { ...gig };
  try {
    if (response.avatar && typeof response.avatar === 'string') {
      response.avatar = JSON.parse(response.avatar);
    }
    if (response.packages && typeof response.packages === 'string') {
      response.packages = JSON.parse(response.packages);
    }
  } catch (e) {
    // Keep original values
  }
  return response;
};

// Get all gigs with filters
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, maxPrice } = req.query;

    const where = {};

    if (category && category !== 'All') {
      where.category = category;
    }

    if (maxPrice) {
      where.startingAt = { lte: Number(maxPrice) };
    }

    const gigs = await prisma.gig.findMany({
      where,
      orderBy: { rating: 'desc' }
    });
    const parsedGigs = gigs.map(parseGigResponse);
    res.json(parsedGigs);
  } catch (error) {
    console.error('Error fetching gigs:', error);
    res.status(500).json({ error: 'Error fetching gigs' });
  }
});

// Get single gig
router.get('/:id', async (req, res) => {
  try {
    const gig = await prisma.gig.findUnique({
      where: { id: req.params.id }
    });
    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }
    res.json(parseGigResponse(gig));
  } catch (error) {
    console.error('Error fetching gig:', error);
    res.status(500).json({ error: 'Error fetching gig' });
  }
});

// Create gig (engineers only)
router.post('/', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });
    if (!user || user.role !== 'freelancer') {
      return res.status(403).json({ error: 'Only engineers can create gigs' });
    }

    const { title, category, icon, accent, startingAt, deliveryDays, description, tags, packages } = req.body;

    let avatarObj = {};
    try {
      if (user.avatar && typeof user.avatar === 'string') {
        avatarObj = JSON.parse(user.avatar);
      } else if (user.avatar) {
        avatarObj = user.avatar;
      }
    } catch (e) {
      avatarObj = { initials: '', bg: 'rgba(37,99,235,0.22)', color: '#60A5FA' };
    }

    const gig = await prisma.gig.create({
      data: {
        engineerId: req.user.id,
        engineerName: user.name,
        initials: avatarObj.initials || '',
        avatar: JSON.stringify(avatarObj),
        title,
        category,
        icon: icon || '',
        accent: accent || '#2563EB',
        startingAt: startingAt || 0,
        deliveryDays: deliveryDays || 7,
        rating: user.rating || 0,
        reviews: 0,
        description: description || '',
        tags: tags || [],
        packages: JSON.stringify(packages || [])
      }
    });

    res.status(201).json(parseGigResponse(gig));
  } catch (error) {
    console.error('Create gig error:', error);
    res.status(500).json({ error: 'Error creating gig' });
  }
});

// Update gig
router.put('/:id', auth, async (req, res) => {
  try {
    const gig = await prisma.gig.findUnique({
      where: { id: req.params.id }
    });
    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    if (gig.engineerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updates = req.body;

    // Handle JSON fields
    if (updates.packages) {
      updates.packages = JSON.stringify(updates.packages);
    }

    const updatedGig = await prisma.gig.update({
      where: { id: req.params.id },
      data: updates
    });

    res.json(parseGigResponse(updatedGig));
  } catch (error) {
    console.error('Error updating gig:', error);
    res.status(500).json({ error: 'Error updating gig' });
  }
});

// Delete gig
router.delete('/:id', auth, async (req, res) => {
  try {
    const gig = await prisma.gig.findUnique({
      where: { id: req.params.id }
    });
    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    if (gig.engineerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await prisma.gig.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Gig deleted successfully' });
  } catch (error) {
    console.error('Error deleting gig:', error);
    res.status(500).json({ error: 'Error deleting gig' });
  }
});

// Get engineer's gigs
router.get('/engineer/my-gigs', auth, async (req, res) => {
  try {
    const gigs = await prisma.gig.findMany({
      where: { engineerId: req.user.id }
    });
    const parsedGigs = gigs.map(parseGigResponse);
    res.json(parsedGigs);
  } catch (error) {
    console.error('Error fetching gigs:', error);
    res.status(500).json({ error: 'Error fetching gigs' });
  }
});

// Order gig (create order)
router.post('/:id/order', auth, async (req, res) => {
  try {
    const { packageIndex } = req.body;
    const gig = await prisma.gig.findUnique({
      where: { id: req.params.id }
    });
    const client = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    if (client.role !== 'client') {
      return res.status(403).json({ error: 'Only clients can order gigs' });
    }

    // Prevent engineer from ordering their own gig
    if (gig.engineerId === req.user.id) {
      return res.status(400).json({ error: 'Cannot order your own gig' });
    }

    let packages = [];
    try {
      packages = gig.packages && typeof gig.packages === 'string' ? JSON.parse(gig.packages) : (gig.packages || []);
    } catch (e) {
      packages = [];
    }

    const selectedPackage = packages[packageIndex];
    if (!selectedPackage) {
      return res.status(400).json({ error: 'Invalid package selection' });
    }

    const order = await prisma.order.create({
      data: {
        clientId: req.user.id,
        engineerId: gig.engineerId,
        gigId: gig.id,
        engineerName: gig.engineerName,
        clientName: client.name,
        gigTitle: gig.title,
        package: JSON.stringify({
          name: selectedPackage.name,
          price: selectedPackage.price,
          delivery: selectedPackage.delivery,
          desc: selectedPackage.desc
        }),
        amount: selectedPackage.price,
        status: 'pending'
      }
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Error processing order:', error);
    res.status(500).json({ error: 'Error processing order' });
  }
});

export default router;