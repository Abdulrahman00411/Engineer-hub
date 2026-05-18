// Model Registry and Initialization
// Central registry for all database models

import User from '../models/User.js';
import Job from '../models/Job.js';
import Gig from '../models/Gig.js';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import Bid from '../models/Bid.js';

// Model registry
const models = {
  User,
  Job,
  Gig,
  Message,
  Conversation,
  Bid
};

// Get model by name
const getModel = (modelName) => {
  const model = models[modelName];
  if (!model) {
    throw new Error(`Model '${modelName}' not found in registry`);
  }
  return model;
};

// Check if model exists
const modelExists = (modelName) => {
  return !!models[modelName];
};

// Get all model names
const getModelNames = () => {
  return Object.keys(models);
};

// Initialize all models (for verification)
const initializeModels = async () => {
  const results = [];

  for (const [name, model] of Object.entries(models)) {
    try {
      // Verify model is properly connected
      const collectionName = model.collection.name;
      results.push({ name, status: 'ok', collection: collectionName });
    } catch (error) {
      results.push({ name, status: 'error', error: error.message });
    }
  }

  return results;
};

// Drop all collections (use with caution!)
const dropAllCollections = async () => {
  const results = {};

  for (const [name, model] of Object.entries(models)) {
    try {
      await model.collection.drop();
      results[name] = 'dropped';
    } catch (error) {
      results[name] = `error: ${error.message}`;
    }
  }

  return results;
};

export {
  models,
  getModel,
  modelExists,
  getModelNames,
  initializeModels,
  dropAllCollections
};