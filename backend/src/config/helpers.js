// Database Helper Functions
// Utility functions for common database operations

import mongoose from 'mongoose';

// Transaction wrapper for atomic operations
const withTransaction = async (callback) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await callback(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// Paginated query helper
const paginate = async (model, query = {}, options = {}) => {
  const {
    page = 1,
    limit = 10,
    sort = { createdAt: -1 },
    select = '',
    populate = ''
  } = options;

  const skip = (page - 1) * limit;

  const [results, total] = await Promise.all([
    model
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(select)
      .populate(populate)
      .lean(),
    model.countDocuments(query)
  ]);

  return {
    results,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }
  };
};

// Soft delete helper (adds deletedAt timestamp)
const softDelete = async (model, id) => {
  return model.findByIdAndUpdate(id, { deletedAt: new Date() });
};

// Restore soft-deleted document
const restore = async (model, id) => {
  return model.findByIdAndUpdate(id, { $unset: { deletedAt: 1 } });
};

// Find or create pattern
const findOrCreate = async (model, query, defaults = {}) => {
  let document = await model.findOne(query).lean();
  if (!document) {
    document = await model.create({ ...query, ...defaults });
    return { document, created: true };
  }
  return { document, created: false };
};

// Bulk upsert helper
const bulkUpsert = async (model, items, identifier = 'email') => {
  const operations = items.map(item => ({
    updateOne: {
      filter: { [identifier]: item[identifier] },
      update: { $set: item },
      upsert: true
    }
  }));

  return model.bulkWrite(operations);
};

// Count with filters
const countWithFilters = async (model, filters = {}) => {
  return model.countDocuments(filters);
};

// Aggregate with pagination wrapper
const aggregatePaginate = async (model, pipeline, options = {}) => {
  const { page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;

  const [results, countResult] = await Promise.all([
    model.aggregate([...pipeline, { $skip: skip }, { $limit: limit }]),
    model.aggregate([...pipeline, { $count: 'total' }])
  ]);

  const total = countResult[0]?.total || 0;

  return {
    results,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

// Lean getter for single document
const findOne = async (model, query, options = {}) => {
  return model.findOne(query).select(options.select || '').populate(options.populate || '').lean();
};

// Update multiple documents
const updateMany = async (model, filter, update) => {
  return model.updateMany(filter, update);
};

// Increment a counter field
const increment = async (model, id, field, amount = 1) => {
  return model.findByIdAndUpdate(id, { $inc: { [field]: amount } });
};

export {
  withTransaction,
  paginate,
  softDelete,
  restore,
  findOrCreate,
  bulkUpsert,
  countWithFilters,
  aggregatePaginate,
  findOne,
  updateMany,
  increment
};