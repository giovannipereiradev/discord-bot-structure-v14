import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Mostra o tempo de resposta do bot.')
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
  category: 'admin',
  cooldown: 3,
  ownerOnly: false,
  enabled: true,

  async execute(interaction) {
    //throw new Error("ERRO FORÇADO PARA TESTE");
    await interaction.reply({ content: '🏓 Pong!', ephemeral: true });
  }
};
