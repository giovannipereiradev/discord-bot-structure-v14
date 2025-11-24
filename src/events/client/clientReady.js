import { log } from '../../services/logger.js';

export default async (client) => {
  log.success(`${client.user.tag} online`);
};