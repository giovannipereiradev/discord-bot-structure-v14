import { createMessage } from '../../utils/messageBuilder.js'
import { log } from '../../services/logger.js';
import { loadConfig } from '../../../config.js';
const config = await loadConfig();

export default async (interaction, client) => {
 
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  if (interaction.user.bot) return;

  if (interaction.user.id !== config.ownerId){
    if (command.ownerOnly) {
      let message = createMessage({message:'Você não tem permissão para usar esse comando.', type:'deny'});
      await interaction.reply({ content: message, ephemeral: true  });
    }

    if (command.enabled == false) {
      let message = createMessage({message:'Esse comando não está ativo.', type:'deny'});
      await interaction.reply({ content: message, ephemeral: true  });
    }
  }

  console.log(interaction)
  console.log(command)

  try {
    await command.execute(interaction, client);

  } catch (err) {
    log.error(`[${interaction.commandName.toUpperCase()}]`);
    console.error(err);

    let message = createMessage({message:'Erro ao executar o comando.', type:'deny'});
    await interaction.reply({ content: message, ephemeral: true  });
  }
};