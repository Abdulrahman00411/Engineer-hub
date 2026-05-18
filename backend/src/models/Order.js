import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  engineerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gigId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
  engineerName: { type: String, required: true },
  clientName: { type: String, required: true },
  gigTitle: { type: String, required: true },
  package: {
    name: String,
    price: Number,
    delivery: Number,
    desc: String
  },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'in-progress', 'delivered', 'completed', 'cancelled'], default: 'pending' },
  timeline: {
    acceptedAt: Date,
    startedAt: Date,
    deliveredAt: Date,
    completedAt: Date
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);
