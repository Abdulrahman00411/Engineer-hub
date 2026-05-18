import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  role: { type: String, enum: ['freelancer', 'client'], required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  engineeringField: { type: String, default: '' },
  hourlyRate: { type: Number, default: 0 },
  avatar: {
    initials: { type: String, default: '' },
    bg: { type: String, default: 'rgba(37,99,235,0.22)' },
    color: { type: String, default: '#60A5FA' }
  },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  projects: { type: Number, default: 0 },
  badge: { type: String, default: 'New' },
  badgeType: { type: String, default: 'gray' },
  available: { type: Boolean, default: true },
  verified: { type: Boolean, default: false },
  joinedDate: { type: String, default: '' },
  bio: { type: String, default: '' },
  skills: [{ type: String }],
  services: [{ type: String }],
  education: [{
    degree: String,
    institute: String,
    year: String,
    grade: String
  }],
  portfolio: [{
    title: String,
    desc: String,
    year: String,
    value: String
  }],
  reviewsList: [{
    client: String,
    rating: Number,
    comment: String,
    date: String
  }],
  completedJobs: { type: Number, default: 0 },
  totalEarned: { type: String, default: '$0' },
  postedJobs: { type: Number, default: 0 },
  totalSpent: { type: String, default: '$0' }
}, { timestamps: true });

export default mongoose.model('User', userSchema);