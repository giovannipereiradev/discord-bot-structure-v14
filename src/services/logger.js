import chalk from "chalk";
import { loadConfig } from '../../config.js';

const config = await loadConfig();

const envPrefix = config.env === "production" ? chalk.red.bold("[PRD]"): chalk.green.bold("[DEV]");

export const log = {
  info: (msg) => console.log(`${envPrefix} ${chalk.cyan("[INFO]")} ${msg}`),
  success: (msg) => console.log(`${envPrefix} ${chalk.green("[SUCCESS]")} ${msg}`),
  warn: (msg) => console.log(`${envPrefix} ${chalk.yellow("[WARN]")} ${msg}`),
  error: (msg) => console.log(`${envPrefix} ${chalk.red("[ERROR]")} ${msg}`),
};
