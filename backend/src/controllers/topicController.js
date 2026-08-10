import { and, eq } from 'drizzle-orm';
import { dailyTopics, userDays, users } from '../db/schema.js';
import { db } from '../lib/db.js';
import { getTodayString } from '../lib/date.js';
import { getOrGenerateTopic } from '../services/topicGeneration.js';
<<<<<<< HEAD

async function buildResponse({ date, feedKey, userId }) {
  const topic = await getOrGenerateTopic({ date, feedKey });
  const [userDay] = await db.select({ id: userDays.id }).from(userDays)
    .where(and(eq(userDays.userId, userId), eq(userDays.date, date))).limit(1);
  return { ...topic, isRead: !!userDay };
=======
import { getTodayString }     from '../lib/date.js';
import { computeFeedKey }     from '../lib/categories.js';

async function buildResponse({ date, feedKey, interests, userId }) {
  const topic  = await getOrGenerateTopic({ date, feedKey, interests });
  const userDay = await UserDay.findOne({ userId, date });
  return { ...topic.toObject(), isRead: !!userDay };
>>>>>>> 286e0078119708acc49e8dc7a295917eeb83f150
}

export async function getToday(req, res, next) {
  try {
<<<<<<< HEAD
    const [user] = await db.select({ feedKey: users.feedKey }).from(users).where(eq(users.id, req.userId)).limit(1);
    if (!user) return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
    const data = await buildResponse({ date: getTodayString(), feedKey: user.feedKey, userId: req.userId });
=======
    const user = await User.findById(req.userId).select('feedKey interests feedKeyAppliesDate');
    const date = getTodayString();

    // Aplicar feedKey pendiente si ya llegó la fecha
    let { feedKey, interests } = user;
    interests = interests ?? [];
    if (user.feedKeyAppliesDate && user.feedKeyAppliesDate <= date) {
      feedKey = computeFeedKey(interests);
      await User.updateOne({ _id: req.userId }, { feedKey, feedKeyAppliesDate: null });
    }

    const data = await buildResponse({ date, feedKey, interests, userId: req.userId });
>>>>>>> 286e0078119708acc49e8dc7a295917eeb83f150
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getByDate(req, res, next) {
  try {
    const { date } = req.params;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ ok: false, error: { code: 'INVALID_DATE', message: 'Date must be YYYY-MM-DD' } });
    }
<<<<<<< HEAD
    const [user] = await db.select({ feedKey: users.feedKey }).from(users).where(eq(users.id, req.userId)).limit(1);
    if (!user) return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
    const [topic] = await db.select().from(dailyTopics)
      .where(and(eq(dailyTopics.date, date), eq(dailyTopics.feedKey, user.feedKey))).limit(1);
    if (!topic) return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'No topic for this date' } });
    const [userDay] = await db.select({ id: userDays.id }).from(userDays)
      .where(and(eq(userDays.userId, req.userId), eq(userDays.date, date))).limit(1);
    res.json({ ok: true, data: { ...topic, isRead: !!userDay } });
=======
    const user = await User.findById(req.userId).select('feedKey');

    // Buscar con feedKey actual; si no existe, caer a 'global'
    let topic = await DailyTopic.findOne({ date, feedKey: user.feedKey });
    if (!topic && user.feedKey !== 'global') {
      topic = await DailyTopic.findOne({ date, feedKey: 'global' });
    }
    // Último recurso: cualquier topic de ese día (cubre feedKeys históricos)
    if (!topic) {
      topic = await DailyTopic.findOne({ date });
    }

    if (!topic) {
      return res.status(404).json({
        ok: false,
        error: { code: 'NOT_FOUND', message: 'No topic for this date' },
      });
    }
    const userDay = await UserDay.findOne({ userId: req.userId, date });
    res.json({ ok: true, data: { ...topic.toObject(), isRead: !!userDay } });
>>>>>>> 286e0078119708acc49e8dc7a295917eeb83f150
  } catch (err) {
    next(err);
  }
}

export async function markRead(req, res, next) {
  try {
    const { date } = req.params;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ ok: false, error: { code: 'INVALID_DATE', message: 'Date must be YYYY-MM-DD' } });
    }
    await db.insert(userDays).values({ userId: req.userId, date })
      .onConflictDoNothing({ target: [userDays.userId, userDays.date] });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
