import express from 'express';
import User from '../models/User.js';
import Job from '../models/Job.js';
import { auth, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all clients
router.get('/', async (req, res) => {
  try {
    const clients = await User.find({ role: 'client' }).sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching clients' });
  }
});

// Get single client
router.get('/:id', async (req, res) => {
  try {
    const client = await User.findById(req.params.id);
    if (!client || client.role !== 'client') {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching client' });
  }
});

// Get client's posted jobs
router.get('/:id/jobs', async (req, res) => {
  try {
    const jobs = await Job.find({ clientId: req.params.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
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

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    ).select('-password');

    if (!user || user.role !== 'client') {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error updating profile' });
  }
});

export default router;