import mongoose from 'mongoose';
import { log } from '../services/logger.js';
import { loadConfig } from '../../config.js';

const config = await loadConfig();

export async function connectMongo() {
  try {
    await mongoose.connect(config.mongoUri);
    log.info('MongoDB connected');
  } catch (error) {
    log.error(`Error MongoDB: ${error.message}`);
  }
}