// env must be imported first so variables are validated before anything else
import './src/lib/env.js';

import express from 'express';
import cors from 'cors';
import { env } from './src/lib/env.js';
import { connectDB } from './src/lib/db.js';

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

// TODO: mount routes here as they're built
// app.use('/api/auth',     authRoutes);
// app.use('/api/topic',    topicRoutes);
// app.use('/api/progress', progressRoutes);
// app.use('/api/chat',     chatRoutes);
// app.use('/api/admin',    adminRoutes);

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
