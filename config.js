import fs from 'fs';
import dotenv from 'dotenv';

let cachedConfig = null;

/**
 * Loads environment-based configuration and returns a normalized config object.
 *
 * @async
 * @function loadConfig
 * @returns {Promise<Object>} A configuration object containing:
 * - `env` {string} The current environment (e.g., "development", "production").
 * - `token` {string} Discord bot token.
 * - `mongoUri` {string} MongoDB connection string.
 * - `ownerId` {string} Discord user ID of the bot owner.
 * - `clientId` {string} Bot application client ID.
 * - `guildId` {string} Guild ID for development/testing environments.
 *
 * @example
 * const config = await loadConfig();
 * console.log(config.token);
 *
 * @throws Will not throw normally, but missing environment variables might
 *         cause runtime issues elsewhere in the application.
*/

export async function loadConfig() {
  // Return cached configuration if it was already loaded
  if (cachedConfig) return cachedConfig;

  const env = process.env.NODE_ENV || 'development';
  const envFile = `.env.${env}`;

  // Load environment-specific file if found, otherwise use default .env
  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
  } else {
    dotenv.config();
  }

  // Build and cache the configuration object
  cachedConfig = {
    env,
    token: process.env.TOKEN,
    mongoUri: process.env.MONGO_URI,
    ownerId: process.env.OWNER_ID,
    clientId: process.env.CLIENT_ID,
    guildId: process.env.GUILD_ID,
  };

  validateRequiredEnv(cachedConfig, ["env", "token", "ownerId"]);

  return cachedConfig;
}

/**
 * Ensures that all required environment variables are present.
 *
 * @param {Object} config - The loaded configuration object.
 * @param {string[]} requiredKeys - List of keys that must not be undefined.
 * @throws {Error} If any required variable is missing.
*/

function validateRequiredEnv( config, requiredKeys ) {
  const missing = requiredKeys.filter((key) => !config[key]);

  if (missing.length > 0) {
    console.error(
      `Missing required environment variables: ${missing.join(", ")}.\n` +
      "Make sure they are defined in your environment or inside the appropriate .env file."
    );
    process.exit(1);
  }
}
