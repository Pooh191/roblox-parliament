const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { LEAVEROOM_ID } = require('../../settings/config.js');
const { EMBEDS } = require('../../settings/embed.js');
const logger = require("../../lib/logger.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('คำร้องขอลาออก'),

    async execute(interaction, client) {
        const user_id = interaction.user.id;

        try {
            let embed = new EmbedBuilder()
                .setTitle(`⭐・คำร้องขอลาออก`)
                .setImage(interaction.user.displayAvatarURL({ dynamic: true, size: 2048, format: "png" }))
                .setDescription(`════════════════════\n> ID︰${user_id}\n════════════════════`)
                .setColor("#0055a5")
                .setFooter({ text: EMBEDS.FOOTER.TEXT, iconURL: EMBEDS.FOOTER.ICON });

            const channel = await client.channels.fetch(LEAVEROOM_ID);

            await channel.send({ embeds: [embed] });
        } catch (error) {
            logger.error('There was an error sending the message.:', error);
            const message_error = new EmbedBuilder()
                .setTitle('ประชาชนครับ ระบบเกิดข้อผิดพลาดในการส่งข้อความครับ!')
                .setColor(EMBEDS.COLORS)
                .setFooter({ text: EMBEDS.FOOTER.TEXT, iconURL: EMBEDS.FOOTER.ICON });
            await interaction.reply({ embeds: [message_error], ephemeral: true });
        }
    }
};
