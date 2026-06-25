import express from 'express';
import { prisma } from '../config/database.js';
import { auth, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all jobs with filters
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, type, search, status } = req.query;

    const where = {};

    if (category && category !== 'All') {
      where.category = category;
    }

    if (type && type !== 'All') {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    const jobs = await prisma.job.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Error fetching jobs' });
  }
});

// Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: req.params.id }
    });
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ error: 'Error fetching job' });
  }
});

// Create job
router.post('/', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });
    if (!user || user.role !== 'client') {
      return res.status(403).json({ error: 'Only clients can post jobs' });
    }

    const { title, category, type, budgetMin, budgetMax, hourlyRate, level, location, tags, description, deadline, urgent } = req.body;

    const budget = type === 'Fixed Price'
      ? `$${budgetMin}${budgetMax ? '-' + budgetMax : ''}`
      : `$${hourlyRate}/hr`;

    const job = await prisma.job.create({
      data: {
        clientId: req.user.id,
        clientName: user.name,
        title,
        category,
        type: type || 'Fixed Price',
        budget,
        budgetMin: budgetMin || 0,
        budgetMax: budgetMax || 0,
        hourlyRate: hourlyRate || 0,
        level: level || 'Intermediate',
        location: location || '',
        tags: tags || [],
        description: description || '',
        deadline: deadline || '',
        urgent: urgent || false,
        posted: new Date().toISOString().split('T')[0],
        bidsCount: 0,
        status: 'open'
      }
    });

    // Update client's postedJobs count
    await prisma.user.update({
      where: { id: req.user.id },
      data: { postedJobs: { increment: 1 } }
    });

    res.status(201).json(job);
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ error: 'Error creating job' });
  }
});

// Get jobs by client
router.get('/client/my-jobs', auth, async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { clientId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching client jobs:', error);
    res.status(500).json({ error: 'Error fetching client jobs' });
  }
});

// Place bid on job
router.post('/:id/bid', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });
    if (!user || user.role !== 'freelancer') {
      return res.status(403).json({ error: 'Only engineers can place bids' });
    }

    const job = await prisma.job.findUnique({
      where: { id: req.params.id }
    });
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Prevent bidding on own job
    if (job.clientId === req.user.id) {
      return res.status(400).json({ error: 'Cannot bid on your own job' });
    }

    // Check if already bid
    const existingBid = await prisma.bid.findFirst({
      where: {
        jobId: job.id,
        engineerId: req.user.id
      }
    });
    if (existingBid) {
      return res.status(400).json({ error: 'You have already placed a bid on this job' });
    }

    const { amount, duration, cover } = req.body;

    const bid = await prisma.bid.create({
      data: {
        jobId: job.id,
        engineerId: req.user.id,
        engineerName: user.name,
        amount: amount || 0,
        duration: duration || 0,
        cover: cover || '',
        status: 'pending'
      }
    });

    // Update job bids count
    await prisma.job.update({
      where: { id: job.id },
      data: { bidsCount: { increment: 1 } }
    });

    res.status(201).json(bid);
  } catch (error) {
    console.error('Place bid error:', error);
    res.status(500).json({ error: 'Error placing bid' });
  }
});

// Get bids for a job
router.get('/:id/bids', auth, async (req, res) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: req.params.id }
    });
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Only job owner can see bids
    if (job.clientId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const bids = await prisma.bid.findMany({
      where: { jobId: job.id },
      include: {
        engineer: {
          select: {
            id: true,
            name: true,
            rating: true,
            reviews: true,
            skills: true,
            avatar: true
          }
        }
      }
    });
    res.json(bids);
  } catch (error) {
    console.error('Error fetching bids:', error);
    res.status(500).json({ error: 'Error fetching bids' });
  }
});

// Accept/Reject bid
router.put('/bid/:bidId', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const bid = await prisma.bid.findUnique({
      where: { id: req.params.bidId }
    });

    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    const job = await prisma.job.findUnique({
      where: { id: bid.jobId }
    });
    if (!job || job.clientId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updatedBid = await prisma.bid.update({
      where: { id: req.params.bidId },
      data: { status }
    });

    if (status === 'accepted') {
      await prisma.job.update({
        where: { id: job.id },
        data: { status: 'in-progress' }
      });
    }

    res.json(updatedBid);
  } catch (error) {
    console.error('Error updating bid:', error);
    res.status(500).json({ error: 'Error updating bid' });
  }
});

// Get bids placed by the logged-in freelancer
router.get('/bids/my-bids', auth, async (req, res) => {
  try {
    const bids = await prisma.bid.findMany({
      where: { engineerId: req.user.id },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            category: true,
            budget: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bids);
  } catch (error) {
    console.error('Error fetching your bids:', error);
    res.status(500).json({ error: 'Error fetching your bids' });
  }
});

export default router;