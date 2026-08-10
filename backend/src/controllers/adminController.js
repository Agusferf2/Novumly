import { dailyTopics } from '../db/schema.js';
import { db } from '../lib/db.js';
import { env } from '../lib/env.js';
import { generateTopic } from '../services/openrouter.js';

export async function generateForDate(req, res, next) {
  try {
    const adminKey = req.headers['x-admin-key'];
    if (!adminKey || adminKey !== env.adminKey) {
      return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Invalid admin key' } });
    }
    const { date } = req.params;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ ok: false, error: { code: 'INVALID_DATE', message: 'Date must be YYYY-MM-DD' } });
    }

    const feedKey = req.query.feedKey || 'global';
    const generated = await generateTopic({ date, recentTitles: [] });
    const [topic] = await db.insert(dailyTopics).values({ date, feedKey, ...generated })
      .onConflictDoUpdate({
        target: [dailyTopics.date, dailyTopics.feedKey],
        set: { ...generated, updatedAt: new Date() },
      }).returning();
    res.json({ ok: true, data: topic });
  } catch (err) {
    next(err);
  }
}
