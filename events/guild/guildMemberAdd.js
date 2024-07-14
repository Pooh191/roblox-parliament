const { EmbedBuilder } = require('discord.js');
const { WELCOMEROOM_ID, RULESROOM_ID, NOT_VERIFICATION } = require('../../settings/config.js');
const { EMBEDS } = require('../../settings/embed.js');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        const { user, guild } = member;
        const welcomeChannel = member.guild.channels.cache.get(WELCOMEROOM_ID);

        const WelcomeEmbed = new EmbedBuilder()
            .setAuthor({ name: `${member.user.username}`, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`ยินดีต้อนรับท่าน <@${member.user.id}> สู่ ${guild.name}\n\n- อย่าลืมไปอ่าน <#${RULESROOM_ID}>\n- อยู่ในระหว่างการปรับปรุง`)
            .setColor(EMBEDS.COLORS)
            .setFooter({ text: EMBEDS.FOOTER.TEXT, iconURL: EMBEDS.FOOTER.ICON });

        welcomeChannel.send({ content: `<@${member.user.id}>`, embeds: [WelcomeEmbed] });
        await member.roles.add(NOT_VERIFICATION);


    }
}