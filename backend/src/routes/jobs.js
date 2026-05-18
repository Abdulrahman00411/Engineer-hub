import express from 'express';
import mongoose from 'mongoose';
import Job from '../models/Job.js';
import Bid from '../models/Bid.js';
import User from '../models/User.js';
import { auth, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all jobs with filters
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, type, search, status } = req.query;

    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (type && type !== 'All') {
      query.type = type;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching jobs' });
  }
});

// Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching job' });
  }
});

// Create job
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'client') {
      return res.status(403).json({ error: 'Only clients can post jobs' });
    }

    const { title, category, type, budgetMin, budgetMax, hourlyRate, level, location, tags, description, deadline, urgent } = req.body;

    const budget = type === 'Fixed Price'
      ? `$${budgetMin}${budgetMax ? '-' + budgetMax : ''}`
      : `$${hourlyRate}/hr`;

    const job = new Job({
      clientId: req.user.id,
      clientName: user.name,
      title,
      category,
      type,
      budget,
      budgetMin,
      budgetMax,
      hourlyRate,
      level,
      location,
      tags: tags || [],
      description,
      deadline,
      urgent,
      posted: new Date().toISOString().split('T')[0],
      bids: 0,
      status: 'open'
    });

    await job.save();

    // Update client's postedJobs count
    await User.findByIdAndUpdate(req.user.id, { $inc: { postedJobs: 1 } });

    res.status(201).json(job);
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ error: 'Error creating job' });
  }
});

// Get jobs by client
router.get('/client/my-jobs', auth, async (req, res) => {
  try {
    const jobs = await Job.find({ clientId: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching client jobs' });
  }
});

// Place bid on job
router.post('/:id/bid', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'freelancer') {
      return res.status(403).json({ error: 'Only engineers can place bids' });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if already bid
    const existingBid = await Bid.findOne({ jobId: job._id, engineerId: new mongoose.Types.ObjectId(req.user.id) });
    if (existingBid) {
      return res.status(400).json({ error: 'You have already placed a bid on this job' });
    }

    const { amount, duration, cover } = req.body;

    const bid = new Bid({
      jobId: job._id,
      engineerId: new mongoose.Types.ObjectId(req.user.id),
      engineerName: user.name,
      amount,
      duration,
      cover,
      status: 'pending'
    });

    await bid.save();

    // Update job bids count
    await Job.findByIdAndUpdate(job._id, { $inc: { bids: 1 } });

    res.status(201).json(bid);
  } catch (error) {
    console.error('Place bid error:', error);
    res.status(500).json({ error: 'Error placing bid' });
  }
});

// Get bids for a job
router.get('/:id/bids', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Only job owner can see bids
    if (job.clientId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const bids = await Bid.find({ jobId: job._id }).populate('engineerId', 'name rating reviews skills avatar');
    res.json(bids);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching bids' });
  }
});

// Accept/Reject bid
router.put('/bid/:bidId', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const bid = await Bid.findById(req.params.bidId);

    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    const job = await Job.findById(bid.jobId);
    if (!job || job.clientId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    bid.status = status;
    await bid.save();

    if (status === 'accepted') {
      job.status = 'in-progress';
      await job.save();
    }

    res.json(bid);
  } catch (error) {
    res.status(500).json({ error: 'Error updating bid' });
  }
});

// Get bids placed by the logged-in freelancer
router.get('/bids/my-bids', auth, async (req, res) => {
  try {
    const bids = await Bid.find({ engineerId: req.user.id })
      .populate('jobId', 'title category budget status')
      .sort({ createdAt: -1 });
    res.json(bids);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching your bids' });
  }
});

export default router;