const dotenv = require('dotenv');

dotenv.config();

// Accept BOTH MONGODB_URI and legacy MONGO_URI so we never silently fail.
const mongoUri = (process.env.MONGODB_URI || process.env.MONGO_URI || '').trim();

const requiredVars = { MONGODB_URI: mongoUri, JWT_SECRET: process.env.JWT_SECRET };
const missingVars = Object.entries(requiredVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length) {
  console.warn(`[config] Missing environment variables: ${missingVars.join(', ')}`);
}

const defaultClientUrls = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  'http://localhost:8000',
  'http://127.0.0.1:8000',
];

const clientUrl = process.env.CLIENT_URL
  ? process.env.CLIENT_URL
      .split(',')
      .map((value) => value.trim().replace(/\/+$/, '')) // trim whitespace + trailing slash
      .filter(Boolean)
  : defaultClientUrls;

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 8000,
  mongoUri,
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl,
};
