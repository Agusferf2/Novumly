import jwt from 'jsonwebtoken';
import { env } from '../lib/env.js';

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({
      ok: false,
      error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token' },
    });
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({
      ok: false,
      error: { code: 'UNAUTHORIZED', message: 'Token expired or invalid' },
    });
  }
}
