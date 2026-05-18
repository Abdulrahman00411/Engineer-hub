import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  engineerName: { type: String, default: '' },
  engineerInitials: { type: String, default: '' },
  clientName: { type: String, default: '' },
  lastMsg: { type: String, default: '' },
  lastTime: { type: String, default: '' },
  unread: {
    type: Map,
    of: Number,
    default: {}
  },
  messages: [{
    id: String,
    from: String,
    text: String,
    time: String,
    date: String
  }]
}, { timestamps: true });

export default mongoose.model('Conversation', conversationSchema);