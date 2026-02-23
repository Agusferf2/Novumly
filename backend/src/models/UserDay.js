import mongoose from 'mongoose';

const userDaySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date:   { type: String, required: true }, // YYYY-MM-DD
  },
  { timestamps: true }
);

userDaySchema.index({ userId: 1, date: 1 }, { unique: true });

export const UserDay = mongoose.model('UserDay', userDaySchema);
