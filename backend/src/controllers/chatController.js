import { User }        from '../models/User.js';
import { DailyTopic }  from '../models/DailyTopic.js';
import { ChatMessage } from '../models/ChatMessage.js';
import { chatWithGroq } from '../services/openrouter.js';
import { getTodayString } from '../lib/date.js';

const MAX_QUESTIONS = 5;

export async function getHistory(req, res, next) {
  try {
    const { date } = req.params;

    const messages = await ChatMessage.find({ userId: req.userId, date })
      .sort({ createdAt: 1 })
      .select('role content createdAt');

    const userCount = messages.filter(m => m.role === 'user').length;
    const questionsLeft = Math.max(0, MAX_QUESTIONS - userCount);

    res.json({ ok: true, data: { messages, questionsLeft } });
  } catch (err) {
    next(err);
  }
}

export async function sendMessage(req, res, next) {
  try {
    const { date } = req.params;
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        ok: false,
        error: { code: 'INVALID_INPUT', message: 'question is required' },
      });
    }

    // Limpieza lazy: borrar mensajes de días anteriores al enviar el primer mensaje del día
    const today = getTodayString();
    if (date === today) {
      const hasToday = await ChatMessage.exists({ userId: req.userId, date: today });
      if (!hasToday) {
        await ChatMessage.deleteMany({ userId: req.userId, date: { $lt: today } });
      }
    }

    // Enforce 5-question daily limit
    const userCount = await ChatMessage.countDocuments({
      userId: req.userId,
      date,
      role: 'user',
    });

    if (userCount >= MAX_QUESTIONS) {
      return res.status(429).json({
        ok: false,
        error: { code: 'LIMIT_REACHED', message: 'Daily question limit reached' },
      });
    }

    // Fetch topic for context (con fallback igual que getByDate)
    const user = await User.findById(req.userId).select('feedKey');
    let topic = await DailyTopic.findOne({ date, feedKey: user.feedKey });
    if (!topic && user.feedKey !== 'global') {
      topic = await DailyTopic.findOne({ date, feedKey: 'global' });
    }
    if (!topic) {
      topic = await DailyTopic.findOne({ date });
    }

    if (!topic) {
      return res.status(404).json({
        ok: false,
        error: { code: 'NOT_FOUND', message: 'No topic for this date' },
      });
    }

    // Fetch chat history to give the model context
    const history = await ChatMessage.find({ userId: req.userId, date })
      .sort({ createdAt: 1 })
      .select('role content');

    // Call Groq
    const answer = await chatWithGroq({ topic, history, question: question.trim() });

    // Persist both messages
    await ChatMessage.insertMany([
      { userId: req.userId, date, role: 'user',      content: question.trim() },
      { userId: req.userId, date, role: 'assistant', content: answer },
    ]);

    const questionsLeft = Math.max(0, MAX_QUESTIONS - userCount - 1);
    res.json({ ok: true, data: { answer, questionsLeft } });
  } catch (err) {
    next(err);
  }
}
