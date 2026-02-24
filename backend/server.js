// env must be imported first so variables are validated before anything else
import './src/lib/env.js';

import express from 'express';
import cors from 'cors';
import { env } from './src/lib/env.js';
import { connectDB } from './src/lib/db.js';
import authRoutes     from './src/routes/auth.js';
import topicRoutes    from './src/routes/topic.js';
import adminRoutes    from './src/routes/admin.js';
import progressRoutes from './src/routes/progress.js';
import { me }             from './src/controllers/authController.js';
import { authMiddleware } from './src/middleware/auth.js';

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.use('/api/auth',  authRoutes);
app.use('/api/topic', topicRoutes);
app.use('/api/admin', adminRoutes);
app.get('/api/me', authMiddleware, me);
app.use('/api/progress', progressRoutes);
// TODO: app.use('/api/chat', chatRoutes);

// Generic error handler
app.use((err, _req, res, _next) => {
  console.error('[error]', err.message);
  res.status(err.status || 500).json({
    ok: false,
    error: { code: err.code || 'INTERNAL_ERROR', message: err.message },
  });
});

connectDB().then(() => {
  app.listen(env.port, () => {
    console.log(`[server] Listening on port ${env.port}`);
  });
});
