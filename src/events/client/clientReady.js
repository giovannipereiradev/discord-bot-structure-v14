import { log } from '../../services/logger.js';

/**
 * Handles the Discord "ready" event.
 * Triggered once when the bot successfully logs in.
 *
 * @async
 * @function readyEvent
*/

export default async (client) => {
  log.success(`${client.user.tag} online`);
};