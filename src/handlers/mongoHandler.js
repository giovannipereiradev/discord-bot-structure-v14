import mongoose from "mongoose";
import { log } from "../services/logger.js";
import { loadConfig } from "../../config.js";

const config = await loadConfig();

/**
 * Connects to MongoDB using the URL defined in the environment variables.
 * If the URL is missing or invalid, the connection is skipped.
 *
 * @async
 * @function connectMongo
 * @returns {Promise<void>}
*/

export async function connectMongo() {
  // Skip connection if URL is missing
  if (!config.mongoUri) {
    log.warn("MongoDB connection skipped: no valid connection URL.");
    return;
  }

  try {
    await mongoose.connect(config.mongoUri);
    log.info("MongoDB connected");
  } catch (error) {
    log.error(`MongoDB connection error: ${error.message}`);
  }
}
