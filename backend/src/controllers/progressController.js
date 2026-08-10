import { and, desc, eq, gte, inArray, lte } from 'drizzle-orm';
import { dailyTopics, userDays, users } from '../db/schema.js';
import { db } from '../lib/db.js';
import { getTodayString } from '../lib/date.js';

export async function getMonth(req, res, next) {
  try {
    const y = Number(req.query.year);
    const m = Number(req.query.month);
    if (!y || !m || m < 1 || m > 12) {
      return res.status(400).json({ ok: false, error: { code: 'INVALID_PARAMS', message: 'year and month are required' } });
    }
    const mm = String(m).padStart(2, '0');
    const startDate = `${y}-${mm}-01`;
    const endDate = `${y}-${mm}-${String(new Date(y, m, 0).getDate()).padStart(2, '0')}`;
    const records = await db.select({ date: userDays.date }).from(userDays)
      .where(and(eq(userDays.userId, req.userId), gte(userDays.date, startDate), lte(userDays.date, endDate)));
    res.json({ ok: true, data: { readDates: records.map(record => record.date) } });
  } catch (err) {
    next(err);
  }
}

export async function getStreak(req, res, next) {
  try {
    const today = getTodayString();
    const records = await db.select({ date: userDays.date }).from(userDays)
      .where(and(eq(userDays.userId, req.userId), lte(userDays.date, today)))
      .orderBy(desc(userDays.date));
    let streak = 0;
    let expected = today;
    for (const record of records) {
      if (record.date !== expected) break;
      streak += 1;
      expected = subtractOneDay(expected);
    }
    res.json({ ok: true, data: { streak } });
  } catch (err) {
    next(err);
  }
}

export async function getRecent(req, res, next) {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 5, 1), 20);
    const days = await db.select({ date: userDays.date }).from(userDays)
      .where(eq(userDays.userId, req.userId)).orderBy(desc(userDays.date)).limit(limit);
    if (days.length === 0) return res.json({ ok: true, data: { topics: [] } });

    const [user] = await db.select({ feedKey: users.feedKey }).from(users).where(eq(users.id, req.userId)).limit(1);
    const dates = days.map(day => day.date);
    const currentTopics = await db.select({ date: dailyTopics.date, title: dailyTopics.title, primaryTag: dailyTopics.primaryTag })
      .from(dailyTopics).where(and(inArray(dailyTopics.date, dates), eq(dailyTopics.feedKey, user?.feedKey || 'global')));
    const byDate = new Map(currentTopics.map(topic => [topic.date, topic]));

    const missingDates = dates.filter(date => !byDate.has(date));
    if (missingDates.length > 0) {
      const fallbackTopics = await db.select({ date: dailyTopics.date, title: dailyTopics.title, primaryTag: dailyTopics.primaryTag })
        .from(dailyTopics).where(inArray(dailyTopics.date, missingDates));
      for (const topic of fallbackTopics) {
        if (!byDate.has(topic.date)) byDate.set(topic.date, topic);
      }
    }
    res.json({ ok: true, data: { topics: dates.map(date => byDate.get(date)).filter(Boolean) } });
  } catch (err) {
    next(err);
  }
}

function subtractOneDay(dateStr) {
  const date = new Date(`${dateStr}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}
