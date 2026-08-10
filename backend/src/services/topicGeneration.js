import { and, desc, eq } from 'drizzle-orm';
import { dailyTopics } from '../db/schema.js';
import { db } from '../lib/db.js';
import { generateTopic } from './openrouter.js';

export async function getOrGenerateTopic({ date, feedKey = 'global' }) {
  const [existing] = await db.select().from(dailyTopics)
    .where(and(eq(dailyTopics.date, date), eq(dailyTopics.feedKey, feedKey))).limit(1);
  if (existing) return existing;

  const recent = await db.select({ title: dailyTopics.title }).from(dailyTopics)
    .where(eq(dailyTopics.feedKey, feedKey)).orderBy(desc(dailyTopics.date)).limit(14);
  const generated = await generateTopic({ date, recentTitles: recent.map(topic => topic.title) });

  const [created] = await db.insert(dailyTopics).values({ date, feedKey, ...generated })
    .onConflictDoNothing({ target: [dailyTopics.date, dailyTopics.feedKey] }).returning();
  if (created) return created;

  const [topic] = await db.select().from(dailyTopics)
    .where(and(eq(dailyTopics.date, date), eq(dailyTopics.feedKey, feedKey))).limit(1);
  return topic;
}
