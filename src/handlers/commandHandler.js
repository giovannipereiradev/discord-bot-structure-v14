import { readdirSync, statSync } from "fs";
import { Collection } from "discord.js";
import { log } from "../services/logger.js";

/**
 * Loads all command modules from the ./src/commands directory and
 * registers them into the client's command collection.
 *
 * Robust version:
 * - Validates that each folder is a directory.
 * - Validates each command file exports `.data` and `.execute`.
 * - Handles errors per command instead of stopping the whole process.
 * - Logs detailed information about loaded and skipped commands.
 *
 * Expected structure:
 * /src/commands/<category>/<command>.js
 *
 * @async
 * @function loadCommands
 * @param {import("discord.js").Client} client - The Discord client instance.
 * @returns {Promise<void>}
*/
export async function loadCommands(client) {
  client.commands = new Collection();

  const basePath = "./src/commands";
  const folders = readdirSync(basePath);

  let loadedCount = 0;
  let failedCount = 0;

  for (const folder of folders) {
    const folderPath = `${basePath}/${folder}`;

    // Skip non-directories
    if (!statSync(folderPath).isDirectory()) {
      log.warn(`Skipping non-directory in commands folder: ${folder}`);
      continue;
    }

    const files = readdirSync(folderPath).filter((f) => f.endsWith(".js"));

    for (const file of files) {
      const filePath = `../commands/${folder}/${file}`;

      try {
        const commandModule = await import(filePath);
        const command = commandModule?.default;

        // Validate export
        if (!command) {
          failedCount++;
          log.error(`Command '${file}' has no default export.`);
          continue;
        }

        if (!command.data || !command.execute) {
          failedCount++;
          log.error(
            `Command '${file}' is missing required properties (data, execute).`
          );
          continue;
        }

        const name = command.data.name;
        client.commands.set(name, command);
        loadedCount++;

      } catch (err) {
        failedCount++;
        log.error(`Failed to load command '${file}': ${err.message}`);
      }
    }
  }

  // Final summary
  log.info(
    `Commands loaded: ${loadedCount} | Failed: ${failedCount} | Total: ${loadedCount + failedCount}`
  );
}