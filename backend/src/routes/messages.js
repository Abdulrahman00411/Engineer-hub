import express from 'express';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get user's conversations
router.get('/', auth, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id
    }).sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching conversations' });
  }
});

// Get single conversation with messages
router.get('/:conversationId', auth, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Check if user is participant
    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching conversation' });
  }
});

// Start new conversation
router.post('/', auth, async (req, res) => {
  try {
    const { participantId, initialMessage } = req.body;

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, participantId] }
    });

    if (!conversation) {
      const msg = {
        id: 'm' + Date.now(),
        from: req.user.id.toString(),
        text: initialMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: 'Today'
      };

      conversation = new Conversation({
        participants: [req.user.id, participantId],
        lastMsg: initialMessage,
        lastTime: msg.time,
        unread: {
          [req.user.id]: 0,
          [participantId]: 1
        },
        messages: [msg]
      });

      await conversation.save();
    } else {
      // Add message to existing conversation
      const msg = {
        id: 'm' + Date.now(),
        from: req.user.id.toString(),
        text: initialMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: 'Today'
      };

      conversation.messages.push(msg);
      conversation.lastMsg = initialMessage;
      conversation.lastTime = msg.time;
      conversation.unread[participantId] = (conversation.unread[participantId] || 0) + 1;

      await conversation.save();
    }

    res.json(conversation);
  } catch (error) {
    console.error('Start conversation error:', error);
    res.status(500).json({ error: 'Error starting conversation' });
  }
});

// Send message
router.post('/:conversationId/message', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const conversation = await Conversation.findById(req.params.conversationId);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Check if user is participant
    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const msg = {
      id: 'm' + Date.now(),
      from: req.user.id.toString(),
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today'
    };

    conversation.messages.push(msg);
    conversation.lastMsg = text;
    conversation.lastTime = msg.time;

    // Increment unread for the other participant
    const otherParticipant = conversation.participants.find(p => p.toString() !== req.user.id);
    conversation.unread[otherParticipant.toString()] = (conversation.unread[otherParticipant.toString()] || 0) + 1;

    await conversation.save();

    res.json(msg);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Error sending message' });
  }
});

// Mark conversation as read
router.put('/:conversationId/read', auth, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    conversation.unread[req.user.id.toString()] = 0;

    await conversation.save();
    res.json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Error marking as read' });
  }
});

export default router;