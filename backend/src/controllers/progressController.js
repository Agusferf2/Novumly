import { UserDay }    from '../models/UserDay.js';
import { DailyTopic } from '../models/DailyTopic.js';
import { User }       from '../models/User.js';
import { getTodayString } from '../lib/date.js';

export async function getMonth(req, res, next) {
  try {
    const { year, month } = req.query;
    const y = Number(year);
    const m = Number(month);

    if (!y || !m || m < 1 || m > 12) {
      return res.status(400).json({
        ok: false,
        error: { code: 'INVALID_PARAMS', message: 'year and month are required' },
      });
    }

    const mm = String(m).padStart(2, '0');
    const startDate = `${y}-${mm}-01`;
    const daysInMonth = new Date(y, m, 0).getDate();
    const endDate = `${y}-${mm}-${String(daysInMonth).padStart(2, '0')}`;

    const records = await UserDay.find({
      userId: req.userId,
      date: { $gte: startDate, $lte: endDate },
    }).select('date');

    const readDates = records.map(r => r.date);
    res.json({ ok: true, data: { readDates } });
  } catch (err) {
    next(err);
  }
}

export async function getStreak(req, res, next) {
  try {
    const today = getTodayString();
    const todayRecord = await UserDay.findOne({ userId: req.userId, date: today });

    if (!todayRecord) {
      return res.json({ ok: true, data: { streak: 0 } });
    }

    let streak = 1;
    let current = today;

    while (true) {
      const prev = subtractOneDay(current);
      const exists = await UserDay.findOne({ userId: req.userId, date: prev });
      if (!exists) break;
      streak++;
      current = prev;
    }

    res.json({ ok: true, data: { streak } });
  } catch (err) {
    next(err);
  }
}

export async function getRecent(req, res, next) {
  try {
    const limit = Math.min(Number(req.query.limit) || 5, 20);

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
    const dailyTopics = await DailyTopic.find({
      date: { $in: dates },
      feedKey,
    }).select('date title primaryTag');

    const topicByDate = {};
    for (const t of dailyTopics) topicByDate[t.date] = t;

    const topics = dates
      .filter(date => topicByDate[date])
      .map(date => ({
        date,
        title: topicByDate[date].title,
        primaryTag: topicByDate[date].primaryTag,
      }));

    res.json({ ok: true, data: { topics } });
  } catch (err) {
    next(err);
  }
}

function subtractOneDay(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}
