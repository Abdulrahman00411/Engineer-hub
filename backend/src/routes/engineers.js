import express from 'express';
import { prisma } from '../config/database.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Helper to parse JSON fields
const parseUserResponse = (user) => {
  if (!user) return user;
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

// Get all engineers with filters
router.get('/', async (req, res) => {
  try {
    const { category, available, search, sort } = req.query;

    const where = { role: 'freelancer' };

    if (category && category !== 'All') {
      where.engineeringField = category;
    }

    if (available === 'true') {
      where.available = true;
    }

    // Implement search functionality
    if (search && search.trim()) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
        { skills: { has: search } }
      ];
    }

    let orderBy = { rating: 'desc' };
    if (sort === 'rate_low') {
      orderBy = { hourlyRate: 'asc' };
    } else if (sort === 'rate_high') {
      orderBy = { hourlyRate: 'desc' };
    }

    const engineers = await prisma.user.findMany({
      where,
      orderBy
    });

    const parsedEngineers = engineers.map(parseUserResponse);
    res.json(parsedEngineers);
  } catch (error) {
    console.error('Error fetching engineers:', error);
    res.status(500).json({ error: 'Error fetching engineers' });
  }
});

// Get single engineer
router.get('/:id', async (req, res) => {
  try {
    const engineer = await prisma.user.findUnique({
      where: { id: req.params.id }
    });
    if (!engineer || engineer.role !== 'freelancer') {
      return res.status(404).json({ error: 'Engineer not found' });
    }
    res.json(parseUserResponse(engineer));
  } catch (error) {
    console.error('Error fetching engineer:', error);
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

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updates
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(parseUserResponse(user));
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Error updating profile' });
  }
});

// Get engineer by category
router.get('/category/:category', async (req, res) => {
  try {
    const engineers = await prisma.user.findMany({
      where: {
        role: 'freelancer',
        engineeringField: req.params.category
      },
      orderBy: { rating: 'desc' }
    });
    const parsedEngineers = engineers.map(parseUserResponse);
    res.json(parsedEngineers);
  } catch (error) {
    console.error('Error fetching engineers:', error);
    res.status(500).json({ error: 'Error fetching engineers' });
  }
});

export default router;