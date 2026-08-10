import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { users } from '../db/schema.js';
import { db } from '../lib/db.js';
import { env } from '../lib/env.js';

function signToken(userId) {
  return jwt.sign({ userId }, env.jwtSecret, { expiresIn: '30d' });
}

export async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION_ERROR', message: 'email and password are required' } });
    }
    if (password.length < 6) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION_ERROR', message: 'password must be at least 6 characters' } });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, normalizedEmail)).limit(1);
    if (existing) {
      return res.status(409).json({ ok: false, error: { code: 'EMAIL_TAKEN', message: 'Email already in use' } });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [user] = await db.insert(users).values({ email: normalizedEmail, passwordHash }).returning({ id: users.id });
    res.status(201).json({ ok: true, data: { token: signToken(user.id) } });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ ok: false, error: { code: 'EMAIL_TAKEN', message: 'Email already in use' } });
    }
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION_ERROR', message: 'email and password are required' } });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const [user] = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ ok: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
    }

    res.json({ ok: true, data: { token: signToken(user.id) } });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    const [user] = await db.select({ email: users.email, feedKey: users.feedKey })
      .from(users).where(eq(users.id, req.userId)).limit(1);
    if (!user) {
      return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
    }
    res.json({ ok: true, data: user });
  } catch (err) {
    next(err);
  }
}
