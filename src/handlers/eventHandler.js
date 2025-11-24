import { readdirSync } from 'fs';
import { log } from '../services/logger.js';

export async function loadEvents(client) {
  const folders = readdirSync('./src/events');

  for (const folder of folders) {
    const files = readdirSync(`./src/events/${folder}`).filter(f => f.endsWith('.js'));

    for (const file of files) {
      const event = await import(`../events/${folder}/${file}`);
      const eventName = file.split('.')[0];
      client.on(eventName, (...args) => event.default(...args, client));
    }
  }
  log.info(`Events loaded`);
}