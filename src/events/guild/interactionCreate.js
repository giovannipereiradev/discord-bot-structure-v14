import { createMessage } from '../../utils/messageBuilder.js'
import { log } from '../../services/logger.js';
import { loadConfig } from '../../../config.js';
const config = await loadConfig();

/**
 * Handles the "interactionCreate" Discord event.
 *
 * This listener processes slash commands, validates permissions,
 * checks command configurations, and executes the corresponding handler.
 *
 * @async
 * @function interactionCreate
*/

export default async (interaction, client) => {
  // Only handle slash commands
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  // Ignore other bots
  if (interaction.user.bot) return;

  // Owner-only check
  if (interaction.user.id !== config.ownerId) {
    if (command.ownerOnly) {
      const message = createMessage({
        message: "Você não tem permissão para usar esse comando.",
        type: "deny",
      });
      return interaction.reply({ content: message, ephemeral: true });
    }

    // Disabled command check
    if (command.enabled === false) {
      const message = createMessage({
        message: "Esse comando não está ativo.",
        type: "deny",
      });
      return interaction.reply({ content: message, ephemeral: true });
    }
  }

  try {
    await command.execute(interaction, client);

  } catch (err) {
    // Log command name for easier debugging
    log.error(`[${interaction.commandName.toUpperCase()}]`);
    console.error(err);

    const message = createMessage({
      message: "Erro ao executar o comando.",
      type: "deny",
    });

    // Safe reply in case the command already replied
    try {
      await interaction.reply({ content: message, ephemeral: true });
    } catch {
      await interaction.followUp({ content: message, ephemeral: true });
    }
  }
};