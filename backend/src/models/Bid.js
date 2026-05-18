import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  engineerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  engineerName: { type: String, required: true },
  amount: { type: Number, required: true },
  duration: { type: Number, default: 0 },
  cover: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Bid', bidSchema);