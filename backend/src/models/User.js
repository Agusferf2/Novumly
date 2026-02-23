import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    feedKey:      { type: String, default: 'global' },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
