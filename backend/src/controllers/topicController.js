import { User }               from '../models/User.js';
import { UserDay }            from '../models/UserDay.js';
import { DailyTopic }         from '../models/DailyTopic.js';
import { getOrGenerateTopic } from '../services/topicGeneration.js';
import { getTodayString }     from '../lib/date.js';
import { computeFeedKey }     from '../lib/categories.js';

async function buildResponse({ date, feedKey, interests, userId }) {
  const topic  = await getOrGenerateTopic({ date, feedKey, interests });
  const userDay = await UserDay.findOne({ userId, date });
  return { ...topic.toObject(), isRead: !!userDay };
}

export async function getToday(req, res, next) {
  try {
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
