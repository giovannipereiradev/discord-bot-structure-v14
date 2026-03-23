# Discord Bot Structure v14

<div align="center">

<img src="discord-bot-structure.png" alt="Bot Structure" width="720" />

![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-Non--Commercial-red?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-ESModules-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-optional-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

</div>

[Para ler em Português, clique aqui!](./README.pt-BR.md)

## About

**Discord Bot Structure v14** is a modular and scalable development base for Discord bots built with **discord.js v14** and **Node.js**. The goal is to provide a clean, robust, and ready-to-scale foundation, letting you focus on the bot's logic without worrying about boilerplate.

It features automatic command and event loading via dynamic handlers, multi-environment support (`development` / `production`) through separate `.env` files, optional **MongoDB** integration via Mongoose, and a colorized log system using **Chalk** for easier terminal debugging.

## Features

| Feature | Description |
|---|---|
| **Automatic handlers** | Dynamic loading of commands and events via `commandHandler` and `eventHandler`, no manual imports required. |
| **Multi-environment** | Native support for `.env.development` and `.env.production`, switching automatically based on `NODE_ENV`. |
| **Config validation** | On startup, required variables (`TOKEN`, `OWNER_ID`) are validated; the process exits with a clear message if anything is missing. |
| **MongoDB integration** | Optional connection via Mongoose. If `MONGO_URI` is not set, the bot starts normally without a database. |
| **Colorized log system** | Logger using **Chalk** that distinguishes `[DEV]` and `[PRD]` with colors, plus `info`, `success`, `warn`, and `error` levels. |
| **Message utilities** | `messageBuilder.js` centralizes the creation of **Embeds** and formatted messages with configurable emojis. |
| **Command control** | Each command supports `ownerOnly`, `enabled`, and `cooldown` fields, with automatic checks in `interactionCreate`. |
| **Slash command deploy** | Dedicated `deploy-commands.js` script to register commands with the Discord API before starting the bot. |

## Architecture

The flow starts from `app.js`, which delegates to `src/index.js`. This initializes the client, connects to MongoDB, and triggers the handlers to dynamically register commands and events.

```
app.js
  └── src/index.js
        ├── loadConfig()         → Loads .env based on NODE_ENV
        ├── connectMongo()       → Connects to MongoDB (optional)
        ├── loadEvents(client)   → Scans src/events/**/*.js and registers listeners
        └── loadCommands(client) → Scans src/commands/**/*.js and populates client.commands
              │
              └── interactionCreate (event)
                    ├── Validates ownerOnly / enabled
                    ├── Handles errors with safe reply/followUp
                    └── command.execute(interaction, client)
```

When a user runs a Slash Command, the `interactionCreate` event retrieves the command from the `Collection`, applies validations (`ownerOnly`, `enabled`), and executes the corresponding handler. Errors are caught individually without crashing the process.

## Technologies

- **[discord.js](https://discord.js.org/) `^14.24.2`**: main library for interacting with the Discord API; provides `Client`, `GatewayIntentBits`, `SlashCommandBuilder`, `Collection`, and permission utilities.
- **[mongoose](https://mongoosejs.com/) `^8.19.3`**: ODM for MongoDB; used for data modeling and persistence.
- **[dotenv](https://github.com/motdotla/dotenv) `^17.2.3`**: loads environment variables from environment-specific `.env.*` files.
- **[chalk](https://github.com/chalk/chalk) `^5.6.2`**: colorized terminal output; used by `logger.js` to distinguish levels and environments visually.
- **[cross-env](https://github.com/kentcdodds/cross-env) `^10.1.0`**: sets `NODE_ENV` portably in npm scripts, ensuring compatibility across Windows, Linux, and macOS.

## Installation

Prerequisites:

- **Node.js** `>= 18.0.0`
- **npm** `>= 8.0.0`
- A Discord application created on the [Discord Developer Portal](https://discord.com/developers/applications) with a bot token, the necessary intents enabled, and the bot added to your server with the `bot` and `applications.commands` scopes.

```bash
git clone https://github.com/giovannipereiradev/discord-bot-structure-v14.git
cd discord-bot-structure-v14
npm install
```

## Configuration

Create the environment files in the project root:

**`.env.development`**
```env
NODE_ENV=development
TOKEN=your_development_token
MONGO_URI=mongodb://localhost:27017/my-bot-dev
OWNER_ID=your_discord_user_id
CLIENT_ID=your_application_id
GUILD_ID=your_test_server_id
```

**`.env.production`**
```env
NODE_ENV=production
TOKEN=your_production_token
MONGO_URI=your_mongodb_atlas_string
OWNER_ID=your_discord_user_id
CLIENT_ID=your_application_id
```

| Variable | Required | Description |
|---|---|---|
| `TOKEN` | Yes | Bot token obtained from the Discord Developer Portal. |
| `OWNER_ID` | Yes | Discord user ID of the bot owner. Used for `ownerOnly` commands. |
| `CLIENT_ID` | Deploy | Application ID. Required for `deploy-commands.js`. |
| `GUILD_ID` | Dev | Test server ID. Omitting it registers commands globally. |
| `MONGO_URI` | No | MongoDB connection string. If absent, the bot starts without a database. |

## Folder Structure

```
discord-bot-structure-v14/
│
├── app.js                      # Entry point
├── config.js                   # .env loader and validation
├── package.json
│
├── .env.development             # Development environment variables (do not version)
├── .env.production              # Production environment variables (do not version)
│
└── src/
    ├── index.js                 # Initializes the Discord client and loads handlers
    ├── deploy-commands.js       # Registers Slash Commands with the Discord API
    │
    ├── commands/                # Slash commands organized by category
    │   ├── admin/               # Admin-only commands
    │   └── utils/
    │       └── ping.js          # /ping - checks bot latency
    │
    ├── events/                  # Discord event handlers grouped by scope
    │   ├── client/
    │   │   └── clientReady.js   # Fires when the bot comes online
    │   └── guild/
    │       └── interactionCreate.js  # Dispatches slash commands; validates ownerOnly and enabled
    │
    ├── handlers/                # Core loading and processing logic
    │   ├── commandHandler.js    # Dynamically loads commands into client.commands
    │   ├── eventHandler.js      # Dynamically registers events on the client
    │   └── mongoHandler.js      # Manages the MongoDB connection
    │
    ├── services/
    │   └── logger.js            # Colorized logger with chalk (INFO/SUCCESS/WARN/ERROR + env)
    │
    └── utils/
        ├── config.json          # Static settings (default embed color, emojis)
        └── messageBuilder.js    # Factory for formatted messages and embeds
```

## How to Use

```bash
# Development environment
npm run dev

# Production environment
npm start
```

**Adding a new slash command**

Create a `.js` file inside a category folder under `src/commands/` and restart the bot. The `commandHandler.js` and `deploy-commands.js` detect and register it automatically.

```js
// src/commands/utils/myCommand.js
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('my-command')
    .setDescription('Command description.')
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

  category: 'utils',
  cooldown: 5,
  ownerOnly: false,
  enabled: true,

  async execute(interaction, client) {
    await interaction.reply({ content: '✅ It works!', ephemeral: true });
  }
};
```

**Adding a new event**

Create a `.js` file inside `src/events/client/` or `src/events/guild/`. The filename must exactly match the Discord event name (e.g., `guildMemberAdd.js`). The `eventHandler.js` registers it automatically on restart.

```js
// src/events/guild/guildMemberAdd.js
import { log } from '../../services/logger.js';

export default async (member, client) => {
  log.info(`New member: ${member.user.tag}`);
};
```

## License

Distributed under the MIT License. See the [LICENSE](LICENSE) file for more details.

<div align="center">
  Developed by <a href="https://giovannitavares.com">Giovanni Tavares</a>
</div>
