import { REST, Routes } from "discord.js";
import { readdirSync, statSync } from "fs";
import { loadConfig } from "../config.js";
import { log } from "./services/logger.js";

/**
 * Loads all valid command files from ./src/commands,
 * converts them to JSON, and deploys them to the Discord API.
 *
 * Files must export a default object with a `data` property
 * (SlashCommandBuilder). Invalid files are skipped.
 *
 * @async
 * @function deployCommands
 * @returns {Promise<void>}
 */
async function deployCommands() {
  const config = await loadConfig();
  const commands = [];

  const basePath = "./src/commands";
  const folders = readdirSync(basePath);

  for (const folder of folders) {
    const folderPath = `${basePath}/${folder}`;

    // Ignore items that are not directories (e.g., misplaced files)
    if (!statSync(folderPath).isDirectory()) {
      log.warn(`Skipping non-directory: ${folder}`);
      continue;
    }

    const files = readdirSync(folderPath).filter(f => f.endsWith(".js"));

    for (const file of files) {
      try {
        const modulePath = `./commands/${folder}/${file}`;
        const imported = await import(modulePath);
        const command = imported?.default;

        // Command must export a valid structure to be registered
        if (!command || !command.data) {
          log.error(`Skipping invalid command file: ${file}`);
          continue;
        }

        // SlashCommandBuilder → JSON
        commands.push(command.data.toJSON());
        log.success(`Registered command: ${command.data.name}`);

      } catch (err) {
        // Prevent one file from breaking the deploy process
        log.error(`Failed to process '${file}': ${err.message}`);
      }
    }
  }

  const rest = new REST().setToken(config.token);

  try {
    await rest.put(
      Routes.applicationCommands(config.clientId),
      { body: commands }
    );

    log.success(`Deployed ${commands.length} commands.`);
  } catch (err) {
    log.error(`Deployment failed: ${err.message}`);
    process.exit(1);
  }
}

deployCommands();