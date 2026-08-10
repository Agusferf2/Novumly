import { and, asc, count, eq, sql } from 'drizzle-orm';
import { chatMessages, dailyTopics, users } from '../db/schema.js';
import { db } from '../lib/db.js';
import { chatWithGroq } from '../services/openrouter.js';

const MAX_QUESTIONS = 5;

export async function getHistory(req, res, next) {
  try {
    const { date } = req.params;
    const messages = await db.select({
      id: chatMessages.id,
      role: chatMessages.role,
      content: chatMessages.content,
      createdAt: chatMessages.createdAt,
    }).from(chatMessages)
      .where(and(eq(chatMessages.userId, req.userId), eq(chatMessages.date, date)))
      .orderBy(asc(chatMessages.createdAt));
    const userCount = messages.filter(message => message.role === 'user').length;
    res.json({ ok: true, data: { messages, questionsLeft: Math.max(0, MAX_QUESTIONS - userCount) } });
  } catch (err) {
    next(err);
  }
}

export async function sendMessage(req, res, next) {
  try {
    const { date } = req.params;
    const question = req.body.question?.trim();
    if (!question) {
      return res.status(400).json({ ok: false, error: { code: 'INVALID_INPUT', message: 'question is required' } });
    }

    const whereUserQuestion = and(
      eq(chatMessages.userId, req.userId),
      eq(chatMessages.date, date),
      eq(chatMessages.role, 'user'),
    );
    const [{ value: initialCount }] = await db.select({ value: count() }).from(chatMessages).where(whereUserQuestion);
    if (initialCount >= MAX_QUESTIONS) {
      return res.status(429).json({ ok: false, error: { code: 'LIMIT_REACHED', message: 'Daily question limit reached' } });
    }

    const [user] = await db.select({ feedKey: users.feedKey }).from(users).where(eq(users.id, req.userId)).limit(1);
    if (!user) return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
    const [topic] = await db.select().from(dailyTopics)
      .where(and(eq(dailyTopics.date, date), eq(dailyTopics.feedKey, user.feedKey))).limit(1);
    if (!topic) return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'No topic for this date' } });

    const history = await db.select({ role: chatMessages.role, content: chatMessages.content })
      .from(chatMessages)
      .where(and(eq(chatMessages.userId, req.userId), eq(chatMessages.date, date)))
      .orderBy(asc(chatMessages.createdAt));
    const answer = await chatWithGroq({ topic, history, question });

    const finalCount = await db.transaction(async tx => {
      // Serializa los envios del mismo usuario para que el limite de cinco sea estricto.
      await tx.execute(sql`select id from users where id = ${req.userId} for update`);
      const [{ value }] = await tx.select({ value: count() }).from(chatMessages).where(whereUserQuestion);
      if (value >= MAX_QUESTIONS) return null;
      await tx.insert(chatMessages).values([
        { userId: req.userId, date, role: 'user', content: question },
        { userId: req.userId, date, role: 'assistant', content: answer },
      ]);
      return value + 1;
    });

    if (finalCount === null) {
      return res.status(429).json({ ok: false, error: { code: 'LIMIT_REACHED', message: 'Daily question limit reached' } });
    }
    res.json({ ok: true, data: { answer, questionsLeft: MAX_QUESTIONS - finalCount } });
  } catch (err) {
    next(err);
  }
}
