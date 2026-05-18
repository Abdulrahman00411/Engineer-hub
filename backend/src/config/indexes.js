// Database Index Configuration
// Define indexes for optimized query performance

import User from '../models/User.js';
import Job from '../models/Job.js';
import Gig from '../models/Gig.js';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import Bid from '../models/Bid.js';

// Create indexes for User model
const createUserIndexes = async () => {
  try {
    // Email index for fast lookup during auth
    await User.collection.createIndex({ email: 1 }, { unique: true });

    // Role-based queries
    await User.collection.createIndex({ role: 1 });

    // Engineer search by field and availability
    await User.collection.createIndex({
      role: 1,
      engineeringField: 1,
      available: 1,
      rating: -1
    });

    // Location-based queries
    await User.collection.createIndex({ location: 1 });

    // Skills search
    await User.collection.createIndex({ skills: 1 });

    console.log('User indexes created successfully');
  } catch (error) {
    console.error('Error creating User indexes:', error);
  }
};

// Create indexes for Job model
const createJobIndexes = async () => {
  try {
    // Client's posted jobs
    await Job.collection.createIndex({ clientId: 1 });

    // Status-based filtering
    await Job.collection.createIndex({ status: 1 });

    // Budget range queries
    await Job.collection.createIndex({ budgetMin: 1, budgetMax: 1 });

    // Posted date for sorting
    await Job.collection.createIndex({ createdAt: -1 });

    // Field-based queries
    await Job.collection.createIndex({ category: 1 });

    // Text search on title and description
    await Job.collection.createIndex(
      { title: 'text', description: 'text' },
      { weights: { title: 10, description: 5 } }
    );

    console.log('Job indexes created successfully');
  } catch (error) {
    console.error('Error creating Job indexes:', error);
  }
};

// Create indexes for Gig model
const createGigIndexes = async () => {
  try {
    // Engineer gigs
    await Gig.collection.createIndex({ engineerId: 1 });

    // Category queries
    await Gig.collection.createIndex({ category: 1 });

    // Price range queries
    await Gig.collection.createIndex({ price: 1 });

    // Rating for sorting
    await Gig.collection.createIndex({ rating: -1 });

    // Availability
    await Gig.collection.createIndex({ available: 1 });

    console.log('Gig indexes created successfully');
  } catch (error) {
    console.error('Error creating Gig indexes:', error);
  }
};

// Create indexes for Message model
const createMessageIndexes = async () => {
  try {
    // Conversation messages
    await Message.collection.createIndex({ conversationId: 1, createdAt: -1 });

    // Sender queries
    await Message.collection.createIndex({ senderId: 1 });

    // Unread messages
    await Message.collection.createIndex({ recipientId: 1, read: 1 });

    console.log('Message indexes created successfully');
  } catch (error) {
    console.error('Error creating Message indexes:', error);
  }
};

// Create indexes for Conversation model
const createConversationIndexes = async () => {
  try {
    // Participant conversations
    await Conversation.collection.createIndex({ participants: 1 });

    // Last activity sorting
    await Conversation.collection.createIndex({ lastActivity: -1 });

    console.log('Conversation indexes created successfully');
  } catch (error) {
    console.error('Error creating Conversation indexes:', error);
  }
};

// Create indexes for Bid model
const createBidIndexes = async () => {
  try {
    // Job bids
    await Bid.collection.createIndex({ jobId: 1 });

    // Engineer bids
    await Bid.collection.createIndex({ engineerId: 1 });

    // Bid status
    await Bid.collection.createIndex({ status: 1 });

    console.log('Bid indexes created successfully');
  } catch (error) {
    console.error('Error creating Bid indexes:', error);
  }
};

// Create all indexes
const createAllIndexes = async () => {
  const indexCreators = [
    createUserIndexes,
    createJobIndexes,
    createGigIndexes,
    createMessageIndexes,
    createConversationIndexes,
    createBidIndexes
  ];

  for (const creator of indexCreators) {
    await creator();
  }

  console.log('All database indexes created successfully');
};

export {
  createUserIndexes,
  createJobIndexes,
  createGigIndexes,
  createMessageIndexes,
  createConversationIndexes,
  createBidIndexes,
  createAllIndexes
};