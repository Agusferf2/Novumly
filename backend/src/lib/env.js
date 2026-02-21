import 'dotenv/config';

const REQUIRED = [
  'MONGO_URI',
  'JWT_SECRET',
  'OPENROUTER_API_KEY',
  'OPENROUTER_MODEL',
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
  openrouterKey:   process.env.OPENROUTER_API_KEY,
  openrouterModel: process.env.OPENROUTER_MODEL,
  port:            Number(process.env.PORT) || 4000,
  adminKey:        process.env.ADMIN_KEY || '',
};
