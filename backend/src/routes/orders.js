import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get orders for current user (as client or engineer)
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ clientId: req.user.id }, { engineerId: req.user.id }]
    }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.clientId.toString() !== req.user.id && order.engineerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching order' });
  }
});

// Update order status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const isClient = order.clientId.toString() === req.user.id;
    const isEngineer = order.engineerId.toString() === req.user.id;
    if (!isClient && !isEngineer) return res.status(403).json({ error: 'Not authorized' });

    order.status = status;
    const now = new Date();

    if (status === 'accepted' && !order.timeline.acceptedAt) {
      order.timeline.acceptedAt = now;
    } else if (status === 'in-progress' && !order.timeline.startedAt) {
      order.timeline.startedAt = now;
    } else if (status === 'delivered' && !order.timeline.deliveredAt) {
      order.timeline.deliveredAt = now;
    } else if (status === 'completed' && !order.timeline.completedAt) {
      order.timeline.completedAt = now;
      // Update engineer stats
      if (isClient) {
        await User.findByIdAndUpdate(order.engineerId, {
          $inc: { completedJobs: 1 }
        });
      }
    }

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error updating order status' });
  }
});

export default router;
