import { log } from '../../services/logger.js';
import { startPresenceRotator } from '../../utils/presenceRotator.js';

/**
 * Handles the Discord "ready" event.
 * Triggered once when the bot successfully logs in.
 *
 * @async
 * @function readyEvent
*/

export default async (client) => {
  log.success(`${client.user.tag} online`);

  // Start rotating presence messages
  startPresenceRotator(client, 5000); 
};