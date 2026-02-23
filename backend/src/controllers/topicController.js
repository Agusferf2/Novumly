import { User }               from '../models/User.js';
import { UserDay }            from '../models/UserDay.js';
import { getOrGenerateTopic } from '../services/topicGeneration.js';
import { getTodayString }     from '../lib/date.js';

async function buildResponse({ date, feedKey, userId }) {
  const topic  = await getOrGenerateTopic({ date, feedKey });
  const userDay = await UserDay.findOne({ userId, date });
  return { ...topic.toObject(), isRead: !!userDay };
}

export async function getToday(req, res, next) {
  try {
    const user = await User.findById(req.userId).select('feedKey');
    const date = getTodayString();
    const data = await buildResponse({ date, feedKey: user.feedKey, userId: req.userId });
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getByDate(req, res, next) {
  try {
    const { date } = req.params;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        ok: false,
        error: { code: 'INVALID_DATE', message: 'Date must be YYYY-MM-DD' },
      });
    }
    const user = await User.findById(req.userId).select('feedKey');
    const data = await buildResponse({ date, feedKey: user.feedKey, userId: req.userId });
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function markRead(req, res, next) {
  try {
    const { date } = req.params;
    await UserDay.findOneAndUpdate(
      { userId: req.userId, date },
      { userId: req.userId, date },
      { upsert: true, new: true }
    );
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
