import { readdirSync, statSync } from "fs";
import { log } from "../services/logger.js";

/**
 * Loads event handlers from the ./src/events directory and
 * registers them on the provided Discord client instance.
 *
 * Events must be placed inside folders and export a default function.
 * Example structure:
 * /src/events/<category>/<eventName>.js
 *
 * @async
 * @function loadEvents
 * @param {import("discord.js").Client} client - Discord client instance.
 * @returns {Promise<void>}
 */
export async function loadEvents(client) {
  const basePath = "./src/events";
  const folders = readdirSync(basePath);

  let loaded = 0;
  let failed = 0;

  for (const folder of folders) {
    const folderPath = `${basePath}/${folder}`;

    // Ignore non-directories inside /events
    if (!statSync(folderPath).isDirectory()) {
      log.warn(`Skipping non-directory: ${folder}`);
      continue;
    }

    const files = readdirSync(folderPath).filter(f => f.endsWith(".js"));

    for (const file of files) {
      const eventPath = `../events/${folder}/${file}`;
      const eventName = file.replace(".js", "");

      try {
        const module = await import(eventPath);
        const handler = module?.default;

        // Event file must export a default function
        if (typeof handler !== "function") {
          failed++;
          log.error(`Invalid event file '${file}' (no default function).`);
          continue;
        }

        // Register event listener
        client.on(eventName, (...args) => handler(...args, client));

        loaded++;
        log.success(`Loaded event: ${eventName}`);

      } catch (err) {
        failed++;
        log.error(`Failed to load event '${file}': ${err.message}`);
      }
    }
  }

  log.info(`Events loaded: ${loaded} | Failed: ${failed}`);
}
