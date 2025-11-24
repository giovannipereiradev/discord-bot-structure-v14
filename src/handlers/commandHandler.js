import { readdirSync } from 'fs';
import { Collection } from 'discord.js';
import { log } from '../services/logger.js';

export async function loadCommands(client) {
  client.commands = new Collection();

  const folders = readdirSync('./src/commands');
  for (const folder of folders) {
    const files = readdirSync(`./src/commands/${folder}`).filter(f => f.endsWith('.js'));

    for (const file of files) {
      const command = await import(`../commands/${folder}/${file}`);
      client.commands.set(command.default.data.name, command.default);
    }
  }
  log.info(`Commands loaded`);
}