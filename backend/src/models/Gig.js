import mongoose from 'mongoose';

const gigSchema = new mongoose.Schema({
  engineerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  engineerName: { type: String, required: true },
  initials: { type: String, default: '' },
  avatar: {
    initials: { type: String, default: '' },
    bg: { type: String, default: 'rgba(37,99,235,0.22)' },
    color: { type: String, default: '#60A5FA' }
  },
  title: { type: String, required: true },
  category: { type: String, required: true },
  icon: { type: String, default: '' },
  accent: { type: String, default: '#2563EB' },
  startingAt: { type: Number, default: 0 },
  deliveryDays: { type: Number, default: 7 },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  description: { type: String, default: '' },
  tags: [{ type: String }],
  packages: [{
    name: String,
    price: Number,
    delivery: Number,
    desc: String
  }]
}, { timestamps: true });

export default mongoose.model('Gig', gigSchema);