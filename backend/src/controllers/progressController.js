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

<<<<<<< HEAD
    const [user] = await db.select({ feedKey: users.feedKey }).from(users).where(eq(users.id, req.userId)).limit(1);
    const dates = days.map(day => day.date);
    const topics = await db.select({ date: dailyTopics.date, title: dailyTopics.title, primaryTag: dailyTopics.primaryTag })
      .from(dailyTopics).where(and(inArray(dailyTopics.date, dates), eq(dailyTopics.feedKey, user?.feedKey || 'global')));
    const byDate = new Map(topics.map(topic => [topic.date, topic]));
    res.json({ ok: true, data: { topics: dates.map(date => byDate.get(date)).filter(Boolean) } });
=======
    const userDays = await UserDay.find({ userId: req.userId })
      .sort({ date: -1 })
      .limit(limit)
      .select('date');

    if (userDays.length === 0) {
      return res.json({ ok: true, data: { topics: [] } });
    }

    const user = await User.findById(req.userId).select('feedKey');
    const feedKey = user?.feedKey || 'global';

    const dates = userDays.map(ud => ud.date);

    // Buscar topics del feedKey actual
    const topicsCurrentFeed = await DailyTopic.find({
      date: { $in: dates },
      feedKey,
    }).select('date title primaryTag');

    const topicByDate = {};
    for (const t of topicsCurrentFeed) topicByDate[t.date] = t;

    // Para fechas sin topic (feedKey histórico distinto), buscar cualquier topic de ese día
    const missingDates = dates.filter(d => !topicByDate[d]);
    if (missingDates.length > 0) {
      const fallbackTopics = await DailyTopic.find({
        date: { $in: missingDates },
      }).select('date title primaryTag');
      for (const t of fallbackTopics) {
        if (!topicByDate[t.date]) topicByDate[t.date] = t;
      }
    }

    const topics = dates
      .filter(date => topicByDate[date])
      .map(date => ({
        date,
        title: topicByDate[date].title,
        primaryTag: topicByDate[date].primaryTag,
      }));

    res.json({ ok: true, data: { topics } });
>>>>>>> 286e0078119708acc49e8dc7a295917eeb83f150
  } catch (err) {
    next(err);
  }
}

function subtractOneDay(dateStr) {
  const date = new Date(`${dateStr}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}
