import express from 'express';
import { prisma } from '../config/database.js';
import { auth, optionalAuth } from '../middleware/auth.js';

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
    // Keep original values
  }
  return response;
};

// Get all clients
router.get('/', async (req, res) => {
  try {
    const clients = await prisma.user.findMany({
      where: { role: 'client' },
      orderBy: { createdAt: 'desc' }
    });
    const parsedClients = clients.map(parseUserResponse);
    res.json(parsedClients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Error fetching clients' });
  }
});

// Get single client
router.get('/:id', async (req, res) => {
  try {
    const client = await prisma.user.findUnique({
      where: { id: req.params.id }
    });
    if (!client || client.role !== 'client') {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(parseUserResponse(client));
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ error: 'Error fetching client' });
  }
});

// Get client's posted jobs
router.get('/:id/jobs', async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { clientId: req.params.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching client jobs:', error);
    res.status(500).json({ error: 'Error fetching client jobs' });
  }
});

// Update client profile
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

    if (!user || user.role !== 'client') {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json(parseUserResponse(user));
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Error updating profile' });
  }
});

export default router;