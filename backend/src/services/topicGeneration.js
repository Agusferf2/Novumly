import { DailyTopic } from '../models/DailyTopic.js';
import { generateTopic } from './openrouter.js';

export async function getOrGenerateTopic({ date, feedKey = 'global', interests = [] }) {
  // Return existing topic if already generated
  const existing = await DailyTopic.findOne({ date, feedKey });
  if (existing) return existing;

  // Fetch last 14 titles to avoid repetition in the prompt
  const recent = await DailyTopic.find({ feedKey })
    .sort({ date: -1 })
    .limit(14)
    .select('title');

  const recentTitles = recent.map(t => t.title);

  // Generate with AI
  const generated = await generateTopic({ date, recentTitles, interests });

  // Save and return — if a concurrent request already saved it (race condition / E11000), fetch it
  try {
    return await DailyTopic.create({ date, feedKey, ...generated });
  } catch (err) {
    if (err.code === 11000) {
      return DailyTopic.findOne({ date, feedKey });
    }
    throw err;
  }
}
