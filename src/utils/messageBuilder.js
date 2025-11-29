import { EmbedBuilder } from "discord.js";
import config from "./config.json" with { type: "json" };

/**
 * Creates a Discord embed with a title, description and color.
 * Falls back to the default color defined in config.json.
 *
 * @function createEmbed
 * @param {Object} params
 * @param {string} params.title - Embed title.
 * @param {string} params.description - Embed description text.
 * @param {number|string} [params.color] - Optional embed color.
 * @returns {EmbedBuilder}
 *
 * @example
 * const embed = createEmbed({ title: "Success", description: "Operation completed." });
*/

export function createEmbed({ title, description, color }) {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color ?? config.color);
}

/**
 * Creates a formatted text message using emojis defined in config.json.
 *
 * @function createMessage
 * @param {Object} params
 * @param {string} params.message - Main message content.
 * @param {"deny"|"confirm"} [params.type] - Message type.
 * @returns {string}
 *
 * @example
 * createMessage({ message: "Access denied.", type: "deny" });
*/

export function createMessage({ message, type }) {
  switch (type) {
    case "deny":
      return `${config.emojis.deny}  **${message}**`;

    case "confirm":
      return `${config.emojis.confirm}  **${message}**`;

    default:
      return `**${message}**`;
  }
}
