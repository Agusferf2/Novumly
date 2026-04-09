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
import chatRoutes     from './src/routes/chat.js';

import { me, updateMe, validateCategoryController } from './src/controllers/authController.js';
import { authMiddleware } from './src/middleware/auth.js';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://novumly.vercel.app',
];

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);

    if (allowedOrigins.includes(origin)) return cb(null, true);

    return cb(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: false, // JWT por header => false (si usás cookies, esto cambia)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/topic', topicRoutes);
app.use('/api/admin', adminRoutes);
app.get('/api/me', authMiddleware, me);
app.patch('/api/me', authMiddleware, updateMe);
app.post('/api/me/validate-category', authMiddleware, validateCategoryController);
app.use('/api/progress', progressRoutes);
app.use('/api/chat', chatRoutes);

app.use((err, _req, res, _next) => {
  console.error('[error]', err);
  res.status(err.status || 500).json({
    ok: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'Unknown error',
    },
  });
});

connectDB()
  .then(() => {
    const port = process.env.PORT || env.port || 3000;

    app.listen(port, () => {
      console.log(`[server] Listening on port ${port}`);
    });
  })
  .catch((e) => {
    console.error('[db] Failed to connect to MongoDB:', e);
    process.exit(1);
  });