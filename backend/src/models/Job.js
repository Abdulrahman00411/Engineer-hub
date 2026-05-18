import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clientName: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, enum: ['Fixed Price', 'Hourly'], default: 'Fixed Price' },
  budget: { type: String, default: '' },
  budgetMin: { type: Number, default: 0 },
  budgetMax: { type: Number, default: 0 },
  hourlyRate: { type: Number, default: 0 },
  level: { type: String, default: 'Intermediate' },
  location: { type: String, default: '' },
  tags: [{ type: String }],
  description: { type: String, default: '' },
  deadline: { type: String, default: '' },
  urgent: { type: Boolean, default: false },
  posted: { type: String, default: '' },
  bids: { type: Number, default: 0 },
  status: { type: String, enum: ['open', 'in-progress', 'completed', 'cancelled'], default: 'open' }
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);