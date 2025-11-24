import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { loadConfig } from '../config.js';
import { log } from './services/logger.js';

const config = await loadConfig();

const commands = [];

const folders = readdirSync('./src/commands');
for (const folder of folders) {
  const files = readdirSync(`./src/commands/${folder}`).filter(f => f.endsWith('.js'));
  for (const file of files) {
    const command = await import(`./commands/${folder}/${file}`);
    commands.push(command.default.data.toJSON());
  }
}

const rest = new REST({ version: '10' }).setToken(config.token);

try {
  if (config.env === 'development') {
    await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: commands }
    );
    log.info('Commands registered on the test server');
  } else {
    await rest.put(
      Routes.applicationCommands(config.clientId),
      { body: commands }
    );
    log.info('Global commands registered');
  }
} catch (error) {
  console.error(error);
}