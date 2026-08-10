import { and, desc, eq } from 'drizzle-orm';
import { dailyTopics } from '../db/schema.js';
import { db } from '../lib/db.js';
import { generateTopic } from './openrouter.js';

<<<<<<< HEAD
export async function getOrGenerateTopic({ date, feedKey = 'global' }) {
  const [existing] = await db.select().from(dailyTopics)
    .where(and(eq(dailyTopics.date, date), eq(dailyTopics.feedKey, feedKey))).limit(1);
=======
export async function getOrGenerateTopic({ date, feedKey = 'global', interests = [] }) {
  // Return existing topic if already generated
  const existing = await DailyTopic.findOne({ date, feedKey });
>>>>>>> 286e0078119708acc49e8dc7a295917eeb83f150
  if (existing) return existing;

  const recent = await db.select({ title: dailyTopics.title }).from(dailyTopics)
    .where(eq(dailyTopics.feedKey, feedKey)).orderBy(desc(dailyTopics.date)).limit(14);
  const generated = await generateTopic({ date, recentTitles: recent.map(topic => topic.title) });

  const [created] = await db.insert(dailyTopics).values({ date, feedKey, ...generated })
    .onConflictDoNothing({ target: [dailyTopics.date, dailyTopics.feedKey] }).returning();
  if (created) return created;

<<<<<<< HEAD
  const [topic] = await db.select().from(dailyTopics)
    .where(and(eq(dailyTopics.date, date), eq(dailyTopics.feedKey, feedKey))).limit(1);
  return topic;
=======
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
>>>>>>> 286e0078119708acc49e8dc7a295917eeb83f150
}
