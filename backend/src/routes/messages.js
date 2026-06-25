import express from 'express';
import { prisma } from '../config/database.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Helper to parse JSON fields
const parseConversationResponse = (conv) => {
  if (!conv) return conv;
  const response = { ...conv };
  try {
    if (response.unread && typeof response.unread === 'string') {
      response.unread = JSON.parse(response.unread);
    }
    if (response.messages && typeof response.messages === 'string') {
      response.messages = JSON.parse(response.messages);
    }
  } catch (e) {
    // Keep original values
  }
  return response;
};

// Get user's conversations
router.get('/', auth, async (req, res) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: { has: req.user.id }
      },
      orderBy: { updatedAt: 'desc' }
    });

    const parsedConversations = conversations.map(parseConversationResponse);
    res.json(parsedConversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Error fetching conversations' });
  }
});

// Get single conversation with messages
router.get('/:conversationId', auth, async (req, res) => {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: req.params.conversationId }
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Check if user is participant
    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json(parseConversationResponse(conversation));
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Error fetching conversation' });
  }
});

// Start new conversation
router.post('/', auth, async (req, res) => {
  try {
    const { participantId, initialMessage } = req.body;

    // Check if conversation already exists
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        participants: { hasEvery: [req.user.id, participantId] }
      }
    });

    let conversation;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (!existingConversation) {
      const msg = [{
        id: 'm' + Date.now(),
        from: req.user.id,
        text: initialMessage,
        time,
        date: 'Today'
      }];

      conversation = await prisma.conversation.create({
        data: {
          participants: [req.user.id, participantId],
          lastMsg: initialMessage,
          lastTime: time,
          unread: JSON.stringify({
            [req.user.id]: 0,
            [participantId]: 1
          }),
          messages: JSON.stringify(msg)
        }
      });
    } else {
      // Add message to existing conversation
      let messages = [];
      try {
        messages = existingConversation.messages && typeof existingConversation.messages === 'string'
          ? JSON.parse(existingConversation.messages)
          : (existingConversation.messages || []);
      } catch (e) {
        messages = [];
      }

      const msg = {
        id: 'm' + Date.now(),
        from: req.user.id,
        text: initialMessage,
        time,
        date: 'Today'
      };
      messages.push(msg);

      let unread = {};
      try {
        unread = existingConversation.unread && typeof existingConversation.unread === 'string'
          ? JSON.parse(existingConversation.unread)
          : (existingConversation.unread || {});
      } catch (e) {
        unread = {};
      }
      unread[participantId] = (unread[participantId] || 0) + 1;

      conversation = await prisma.conversation.update({
        where: { id: existingConversation.id },
        data: {
          messages: JSON.stringify(messages),
          lastMsg: initialMessage,
          lastTime: time,
          unread: JSON.stringify(unread)
        }
      });
    }

    res.json(parseConversationResponse(conversation));
  } catch (error) {
    console.error('Start conversation error:', error);
    res.status(500).json({ error: 'Error starting conversation' });
  }
});

// Send message
router.post('/:conversationId/message', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const conversation = await prisma.conversation.findUnique({
      where: { id: req.params.conversationId }
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Check if user is participant
    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msg = {
      id: 'm' + Date.now(),
      from: req.user.id,
      text,
      time,
      date: 'Today'
    };

    let messages = [];
    try {
      messages = conversation.messages && typeof conversation.messages === 'string'
        ? JSON.parse(conversation.messages)
        : (conversation.messages || []);
    } catch (e) {
      messages = [];
    }
    messages.push(msg);

    let unread = {};
    try {
      unread = conversation.unread && typeof conversation.unread === 'string'
        ? JSON.parse(conversation.unread)
        : (conversation.unread || {});
    } catch (e) {
      unread = {};
    }

    // Increment unread for the other participant
    const otherParticipant = conversation.participants.find(p => p !== req.user.id);
    if (otherParticipant) {
      unread[otherParticipant] = (unread[otherParticipant] || 0) + 1;
    }

    await prisma.conversation.update({
      where: { id: req.params.conversationId },
      data: {
        messages: JSON.stringify(messages),
        lastMsg: text,
        lastTime: time,
        unread: JSON.stringify(unread)
      }
    });

    res.json(msg);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Error sending message' });
  }
});

// Mark conversation as read
router.put('/:conversationId/read', auth, async (req, res) => {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: req.params.conversationId }
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    let unread = {};
    try {
      unread = conversation.unread && typeof conversation.unread === 'string'
        ? JSON.parse(conversation.unread)
        : (conversation.unread || {});
    } catch (e) {
      unread = {};
    }
    unread[req.user.id] = 0;

    await prisma.conversation.update({
      where: { id: req.params.conversationId },
      data: {
        unread: JSON.stringify(unread)
      }
    });

    res.json({ message: 'Marked as read' });
  } catch (error) {
    console.error('Error marking as read:', error);
    res.status(500).json({ error: 'Error marking as read' });
  }
});

export default router;