import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date:   { type: String, required: true }, // YYYY-MM-DD
    role:   { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

chatMessageSchema.index({ userId: 1, date: 1 });

export const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
