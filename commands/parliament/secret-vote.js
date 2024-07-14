const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { EMBEDS } = require('../../settings/embed.js');
const logger = require("../../lib/logger.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('secret-vote')
        .setDescription('ระบบการลงมติแบบลับตามข้อบังคับการประชุม (ใช้ในการประชุมสภา)')
        .addStringOption(option => option
            .setName('poll-title')
            .setDescription('ชื่อเรื่องที่จะดำเนินการลงคะแนนลับ')
            .setMaxLength(150)
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('duration')
            .setDescription('ระยะเวลาการลงคะแนน')
            .setRequired(true)
            .addChoices(
                { name: '1 นาที', value: '1นาที' },
                { name: '5 นาที', value: '5นาที' },
                { name: '10 นาที', value: '10นาที' },
                { name: '30 นาที', value: '30นาที' },
                { name: '1 ชั่วโมง', value: '1ชั่วโมง' },
                { name: '8 ชั่วโมง', value: '8ชั่วโมง' },
                { name: '1 วัน', value: '1วัน' },
            )),

    async execute(interaction, client) {
        try {

            const member = interaction.guild.members.cache.get(interaction.user.id);
            const roles = member.roles.cache;

            const allowedRoleIds = ['1229003335508688987', '1229003335508688987'];

            const hasPermission = allowedRoleIds.some(roleId => roles.has(roleId));

            if (!hasPermission) {
                const noPermissionEmbed = new EmbedBuilder()
                    .setTitle('ท่านสมาชิกครับ ท่านสมาชิกไม่มีสิทธิ์ใช้งานคำสั่งนี้ครับ!')
                    .setColor(EMBEDS.COLORS)
                    .setFooter({ text: EMBEDS.FOOTER.TEXT, iconURL: EMBEDS.FOOTER.ICON });

                await interaction.reply({ embeds: [noPermissionEmbed], ephemeral: true });
                return;
            }

            await interaction.deferReply();

            const showIdentityButton = new ButtonBuilder()
                .setCustomId('appear')
                .setLabel('แสดงตน')
                .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder()
                .addComponents(showIdentityButton);

            const send_appear = new EmbedBuilder()
                .setTitle(`กรุณากดปุ่ม "แสดงตน" ก่อนที่จะลงคะแนน`)
                .setColor(EMBEDS.COLORS)
                .setFooter({ text: EMBEDS.FOOTER.TEXT, iconURL: EMBEDS.FOOTER.ICON });

            const replyMessage = await interaction.editReply({
                embeds: [send_appear],
                components: [row],
            });

            const messageId = replyMessage.id;

            const pollTitle = interaction.options.getString('poll-title');
            const duration = interaction.options.getString('duration');

            const data = {
                "poll-title": pollTitle,
                "duration": duration,
                "messageId": messageId
            };

            const jsonData = JSON.stringify(data);

            const filePath = path.join(__dirname, '../../database/secret-vote/vote_data.json');

            fs.writeFile(filePath, jsonData, (err) => {
                if (err) {
                    logger.error('Error writing file:', err);
                    const databasesecretvote_error = new EmbedBuilder()
                        .setTitle(`ท่านสมาชิกครับ ระบบเกิดข้อผิดพลาดขณะดำเนินการคำสั่งการลงมติแบบลับ!`)
                        .setColor(EMBEDS.COLORS)
                        .setFooter({ text: EMBEDS.FOOTER.TEXT, iconURL: EMBEDS.FOOTER.ICON });
                    interaction.followUp({ embeds: [databasesecretvote_error], ephemeral: true });
                } else {
                    logger.info('Secret voting information has been recorded.');
                }
            });
        } catch (error) {
            logger.error('Error executing secret-vote command:', error);
            const secretvote_error = new EmbedBuilder()
                .setTitle(`ท่านสมาชิกครับ ระบบเกิดข้อผิดพลาดขณะดำเนินการคำสั่งในการลงมติแบบลับ!`)
                .setColor(EMBEDS.COLORS)
                .setFooter({ text: EMBEDS.FOOTER.TEXT, iconURL: EMBEDS.FOOTER.ICON });

            await interaction.followUp({ embeds: [secretvote_error], ephemeral: true });
        }
    }
};
