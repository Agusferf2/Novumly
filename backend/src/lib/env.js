import 'dotenv/config';

const REQUIRED = [
  'MONGO_URI',
  'JWT_SECRET',
  'GROQ_API_KEY',
  'GROQ_MODEL_TOPIC',
  'GROQ_MODEL_CHAT',
];

for (const key of REQUIRED) {
  if (!process.env[key]) {
    console.error(`[env] Missing required env variable: ${key}`);
    process.exit(1);
  }
}

export const env = {
  mongoUri:        process.env.MONGO_URI,
  jwtSecret:       process.env.JWT_SECRET,
  groqKey:        process.env.GROQ_API_KEY,
  groqModelTopic: process.env.GROQ_MODEL_TOPIC,
  groqModelChat:  process.env.GROQ_MODEL_CHAT,
  port:            Number(process.env.PORT) || 4000,
  adminKey:        process.env.ADMIN_KEY || '',
};
