import { Client, GatewayIntentBits } from 'discord.js';
import { connectMongo } from './handlers/mongoHandler.js';
import { loadEvents } from './handlers/eventHandler.js';
import { loadCommands } from './handlers/commandHandler.js';
import { loadConfig } from '../config.js';
const config = await loadConfig();

/**
 * Creates a new Discord client instance.
 * Intents determine which events and data the bot receives.
 * @type {Client}
*/
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

//Establishes MongoDB connection. Throws an error if it fails.
await connectMongo();

/**
 * Loads and registers all event listeners for the Discord client.
 * @param {Client} client - The Discord client instance.
*/
await loadEvents(client);

/**
 * Loads and registers all slash commands and command handlers.
 * @param {Client} client - The Discord client instance.
*/
await loadCommands(client);

//Authenticates the bot with Discord using the provided token.
client.login(config.token);