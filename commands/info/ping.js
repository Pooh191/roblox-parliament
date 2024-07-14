const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { EMBEDS } = require('../../settings/embed.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('ดูสถานะการปิงของบอท '),
    async execute(interaction, client) {
        const ping = new EmbedBuilder()
            .setTitle('สถานะการปิงของบอท')
            .setDescription(`API Latency: ${client.ws.ping} Ms\nClient Ping: ${Date.now() - interaction.createdTimestamp} Ms`)
            .setColor(EMBEDS.COLORS)
            .setFooter({ text: EMBEDS.FOOTER.TEXT, iconURL: EMBEDS.FOOTER.ICON });

        await interaction.reply({ embeds: [ping], ephemeral: true });
    }
}
