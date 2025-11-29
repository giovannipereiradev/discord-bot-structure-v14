import chalk from "chalk";
import { loadConfig } from "../../config.js";

const config = await loadConfig();

/**
 * Prefix added to all log messages based on the current environment.
 * [DEV] → green | [PRD] → red
 * @type {string}
*/
const envPrefix =
  config.env === "production"
    ? chalk.red.bold("[PRD]")
    : chalk.green.bold("[DEV]");

/**
 * Logger utility with colored output.
 *
 * Provides methods for informational, success, warning, and error messages.
 *
 * @namespace log
 *
 * @example
 * import { log } from "./services/logger.js";
 * log.info("Starting application...");
*/
export const log = {
  //Log informational messages
  info: (msg) =>
    console.log(`${envPrefix} ${chalk.cyan("[INFO]")} ${msg}`),

  //Log success messages
  success: (msg) =>
    console.log(`${envPrefix} ${chalk.green("[SUCCESS]")} ${msg}`),

  //Log warning messages
  warn: (msg) =>
    console.log(`${envPrefix} ${chalk.yellow("[WARN]")} ${msg}`),

  //Log error messages
  error: (msg) =>
    console.log(`${envPrefix} ${chalk.red("[ERROR]")} ${msg}`),
};