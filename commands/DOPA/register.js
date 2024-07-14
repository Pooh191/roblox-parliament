const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { REGISTER_ROOMLOGS, PEOPLE_ROLEID, NOT_VERIFICATION } = require('../../settings/config.js');
const { EMBEDS } = require('../../settings/embed.js');
const logger = require("../../lib/logger.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('ยืนยันตัวตนกับนายทะเบียนกรมการปกครอง')
        .addStringOption(option => option
            .setName('prefix')
            .setDescription('คำนำหน้าของคุณ')
            .setMaxLength(50)
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('firstname')
            .setDescription('ชื่อ (นามสมมุติก็ได้)')
            .setMaxLength(50)
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('lastname')
            .setDescription('นามสกุล (นามสมมุติก็ได้)')
            .setMaxLength(50)
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('username_roblox')
            .setDescription('ชื่อในเกมส์ roblox (ถ้าไม่มีให้กรอกว่าไม่มี)')
            .setMaxLength(50)
            .setRequired(true)
        ),

    async execute(interaction, client) {
        const prefix = interaction.options.getString('prefix');
        const firstname = interaction.options.getString('firstname');
        const lastname = interaction.options.getString('lastname');
        const username_roblox = interaction.options.getString('username_roblox');
        const user_id = interaction.user.id;

        let embed = new EmbedBuilder()
            .setTitle(`⭐・ข้อมูลสมาชิก`)
            .setImage(interaction.user.displayAvatarURL({ dynamic: true, size: 2048, format: "png" }))
            .setDescription(`════════════════════\n> Username︰<@${user_id}>\n> Name︰${prefix} ${firstname} ${lastname}\n> ID︰${user_id}\n> Roblox Account︰${username_roblox}\n════════════════════`)
            .setColor("#0055a5")
            .setFooter({ text: EMBEDS.FOOTER.TEXT, iconURL: EMBEDS.FOOTER.ICON });

        try {
            const roleToRemove = interaction.guild.roles.cache.get(NOT_VERIFICATION);
            if (roleToRemove) {
                await interaction.member.roles.remove(roleToRemove);
            } else {
                logger.warn('Can not find the role that needs to be removed!');
            }

            const roleToAdd = interaction.guild.roles.cache.get(PEOPLE_ROLEID);
            if (roleToAdd) {
                await interaction.member.roles.add(roleToAdd);
            } else {
                logger.warn('Can not find the role that needs to be removed!');
            }

            const channel = await client.channels.fetch(REGISTER_ROOMLOGS);

            await channel.send({ embeds: [embed] });

            const messagesend_dopa = new EmbedBuilder()
                .setTitle('เราได้ลงระบบกรมการปกครองเรียบร้อยแล้วครับ')
                .setColor(EMBEDS.COLORS)
                .setFooter({ text: EMBEDS.FOOTER.TEXT, iconURL: EMBEDS.FOOTER.ICON });

            await interaction.reply({ embeds: [messagesend_dopa] });
        } catch (error) {
            logger.error('There was an error sending the message.:', error);
            const message_error = new EmbedBuilder()
                .setTitle('ประชาชนครับ ระบบเกิดข้อผิดพลาดในการส่งข้อความครับ!')
                .setColor(EMBEDS.COLORS)
                .setFooter({ text: EMBEDS.FOOTER.TEXT, iconURL: EMBEDS.FOOTER.ICON });
            await interaction.reply({ embeds: [message_error], ephemeral: true });
        }
    }
}