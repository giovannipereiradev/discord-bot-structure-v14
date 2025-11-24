import fs from 'fs';
import dotenv from 'dotenv';

let cachedConfig = null;

export async function loadConfig() {
  if (cachedConfig) return cachedConfig;

  const env = process.env.NODE_ENV || 'development';
  const envFile = `.env.${env}`;

  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
  } else {
    dotenv.config();
  }

  cachedConfig = {
    env,
    token: process.env.TOKEN,
    mongoUri: process.env.MONGO_URI,
    ownerId: process.env.OWNER_ID,
    clientId: process.env.CLIENT_ID,
    guildId: process.env.GUILD_ID,
  };

  return cachedConfig;
}