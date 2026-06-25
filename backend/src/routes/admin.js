import express from 'express';
import { prisma } from '../config/database.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Delete all data (for development/testing) - Admin only
router.delete('/clear-all', auth, async (req, res) => {
  try {
    // Only allow admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    await prisma.message.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.order.deleteMany();
    await prisma.bid.deleteMany();
    await prisma.gig.deleteMany();
    await prisma.job.deleteMany();
    await prisma.user.deleteMany();

    res.json({ message: 'All data cleared successfully' });
  } catch (error) {
    console.error('Error clearing data:', error);
    res.status(500).json({ error: 'Error clearing data' });
  }
});

export default router;