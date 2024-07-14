const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,PermissionFlagsBits } = require('discord.js');
const { CLIENT_ID } = require('../../settings/config.js');
const { EMBEDS } = require('../../settings/embed.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('ลิงค์เชิญบอทสำหรับผู้ดูแล')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction, client) {

        const inviteembed = new EmbedBuilder()
            .setTitle(`ลิงค์เชิญบอท`)
            .setDescription('กรุณากดปุ่มด้านล่างครับ')
            .setColor(EMBEDS.COLORS)
            .setFooter({ text: EMBEDS.FOOTER.TEXT, iconURL: EMBEDS.FOOTER.ICON });

        const buttonlink = new ButtonBuilder()
            .setLabel('Invite Link')
            .setURL(`https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=0&scope=bot+applications.commands`)
            .setStyle(ButtonStyle.Link);

        const row = new ActionRowBuilder()
            .addComponents(buttonlink);

        await interaction.reply({ embeds: [inviteembed], components: [row], ephemeral: true });

    }
};
