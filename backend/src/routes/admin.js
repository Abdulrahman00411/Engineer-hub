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

// Get platform statistics - Admin only
router.get('/stats', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const [
      totalUsers,
      totalFreelancers,
      totalClients,
      totalJobs,
      totalGigs,
      totalOrders,
      totalBids,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'freelancer' } }),
      prisma.user.count({ where: { role: 'client' } }),
      prisma.job.count(),
      prisma.gig.count(),
      prisma.order.count(),
      prisma.bid.count(),
    ]);

    // Get recent data
    const recentJobs = await prisma.job.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      stats: {
        totalUsers,
        totalFreelancers,
        totalClients,
        totalJobs,
        totalGigs,
        totalOrders,
        totalBids,
      },
      recentJobs,
      recentOrders,
      recentUsers,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Error fetching stats' });
  }
});

export default router;