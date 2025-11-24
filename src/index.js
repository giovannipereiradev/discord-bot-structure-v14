import { Client, GatewayIntentBits } from 'discord.js';
import { connectMongo } from './handlers/mongoHandler.js';
import { loadEvents } from './handlers/eventHandler.js';
import { loadCommands } from './handlers/commandHandler.js';
import { loadConfig } from '../config.js';

const config = await loadConfig();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

await connectMongo();
await loadEvents(client);
await loadCommands(client);

client.login(config.token)