import { EmbedBuilder } from 'discord.js';
import config from './config.json' with { type: 'json' };

export function createEmbed({ title, description, color }) {
  return new EmbedBuilder().setTitle(title).setDescription(description).setColor(color ?? config.color);
}

export function createMessage({ message, type }) {

  switch ( type ) {
    case 'deny':
      return `${config.emojis.deny}  **${message}**`

    case 'confirm':
      return `${config.emojis.confirm}  **${message}**`

    default:
      return `**${message}**`

  }
}