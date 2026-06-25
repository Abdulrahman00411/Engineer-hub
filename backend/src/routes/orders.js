import express from 'express';
import { prisma } from '../config/database.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Helper to parse JSON fields
const parseOrderResponse = (order) => {
  if (!order) return order;
  const response = { ...order };
  try {
    if (response.package && typeof response.package === 'string') {
      response.package = JSON.parse(response.package);
    }
    if (response.timeline && typeof response.timeline === 'string') {
      response.timeline = JSON.parse(response.timeline);
    }
  } catch (e) {
    // Keep original values
  }
  return response;
};

// Get orders for current user (as client or engineer)
router.get('/', auth, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { clientId: req.user.id },
          { engineerId: req.user.id }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
    const parsedOrders = orders.map(parseOrderResponse);
    res.json(parsedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id }
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.clientId !== req.user.id && order.engineerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    res.json(parseOrderResponse(order));
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Error fetching order' });
  }
});

// Update order status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await prisma.order.findUnique({
      where: { id: req.params.id }
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const isClient = order.clientId === req.user.id;
    const isEngineer = order.engineerId === req.user.id;
    if (!isClient && !isEngineer) return res.status(403).json({ error: 'Not authorized' });

    const now = new Date().toISOString();
    let timeline = {};
    try {
      timeline = order.timeline && typeof order.timeline === 'string'
        ? JSON.parse(order.timeline)
        : (order.timeline || {});
    } catch (e) {
      timeline = {};
    }

    if (status === 'accepted' && !timeline.acceptedAt) {
      timeline.acceptedAt = now;
    } else if (status === 'in-progress' && !timeline.startedAt) {
      timeline.startedAt = now;
    } else if (status === 'delivered' && !timeline.deliveredAt) {
      timeline.deliveredAt = now;
    } else if (status === 'completed' && !timeline.completedAt) {
      timeline.completedAt = now;
      // Update engineer stats
      if (isClient) {
        await prisma.user.update({
          where: { id: order.engineerId },
          data: { completedJobs: { increment: 1 } }
        });
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        status,
        timeline: JSON.stringify(timeline)
      }
    });

    res.json(parseOrderResponse(updatedOrder));
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Error updating order status' });
  }
});

export default router;