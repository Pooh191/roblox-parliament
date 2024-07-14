const { EmbedBuilder } = require('discord.js');
const { LEAVEROOM_ID } = require('../../settings/config.js');
const { EMBEDS } = require('../../settings/embed.js');

module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
        const { user, guild } = member;
        const leaveChannel = member.guild.channels.cache.get(LEAVEROOM_ID);

        const LeaveEmbed = new EmbedBuilder()
            .setAuthor({ name: `${member.user.username}`, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`ลาก่อนนะ <@${member.user.id}> `)
            .setColor(EMBEDS.COLORS)
            .setFooter({ text: EMBEDS.FOOTER.TEXT, iconURL: EMBEDS.FOOTER.ICON });

            leaveChannel.send({ content: `<@${member.user.id}>`, embeds: [LeaveEmbed] });


    }
}