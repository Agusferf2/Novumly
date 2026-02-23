import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../lib/env.js';

function signToken(userId) {
  return jwt.sign({ userId }, env.jwtSecret, { expiresIn: '30d' });
}

export async function register(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        error: { code: 'VALIDATION_ERROR', message: 'email and password are required' },
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        ok: false,
        error: { code: 'VALIDATION_ERROR', message: 'password must be at least 6 characters' },
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        ok: false,
        error: { code: 'EMAIL_TAKEN', message: 'Email already in use' },
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash });
    const token = signToken(user._id);

    res.status(201).json({ ok: true, data: { token } });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        error: { code: 'VALIDATION_ERROR', message: 'email and password are required' },
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        ok: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
      });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({
        ok: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
      });
    }

    const token = signToken(user._id);
    res.json({ ok: true, data: { token } });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.userId).select('email feedKey');
    if (!user) {
      return res.status(404).json({
        ok: false,
        error: { code: 'NOT_FOUND', message: 'User not found' },
      });
    }
    res.json({ ok: true, data: { email: user.email, feedKey: user.feedKey } });
  } catch (err) {
    next(err);
  }
}
