import mongoose from 'mongoose';

const keyPointSchema = new mongoose.Schema(
  { title: String, content: String },
  { _id: false }
);

const dailyTopicSchema = new mongoose.Schema(
  {
    date:       { type: String, required: true },       // YYYY-MM-DD
    feedKey:    { type: String, required: true, default: 'global' },
    topicKey:   { type: String, required: true },        // slug
    primaryTag: { type: String, required: true },
    title:      { type: String, required: true },
    resume:     { type: String, required: true },
    keyPoints:  { type: [keyPointSchema], default: [] },
  },
  { timestamps: true }
);

dailyTopicSchema.index({ date: 1, feedKey: 1 }, { unique: true });

export const DailyTopic = mongoose.model('DailyTopic', dailyTopicSchema);
