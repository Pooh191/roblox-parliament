const { ButtonBuilder, ButtonStyle, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { EMBEDS } = require('../../settings/embed.js');
const logger = require("../../lib/logger.js");

module.exports = {
    data: {
        name: 'appear',
    },
    async execute(interaction, client) {
        try {
            const filePath = path.join(__dirname, '../../database/secret-vote/vote_data.json');

            const rawData = fs.readFileSync(filePath);
            const voteData = JSON.parse(rawData);

            const motionTitle = voteData["poll-title"];
            const duration = voteData["duration"];

            if (!motionTitle) {
                logger.error('Motion title is not defined.');
                const motionTitle_error = new EmbedBuilder()
                    .setTitle(`ท่านสมาชิกครับ ระบบเกิดข้อผิดพลาดขณะกำหนดหัวข้อในการลงมติครับ!!`)
                    .setColor(EMBEDS.COLORS)
                    .setFooter({ text: EMBEDS.FOOTER.TEXT, iconURL: EMBEDS.FOOTER.ICON });

                await interaction.reply({ embeds: [motionTitle_error], ephemeral: true });
                return;
            }

            if (!voteData[motionTitle]) {
                voteData[motionTitle] = {
                    approve: 0,
                    disapprove: 0,
                    abstain: 0,
                    hasVoted: {},
                    presence: 0,
                };
            }

            const motionEmbed = new EmbedBuilder()
                .setAuthor({ name: `การลงมติ: ${motionTitle}`, iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Seal_of_the_Parliament_of_Thailand.svg/170px-Seal_of_the_Parliament_of_Thailand.svg.png' })
                .setDescription(`ผู้ใดเห็นควรให้มีความเห็นชอบ **กรุณากดปุ่มเห็นด้วย** ผู้ใดเห็นควรให้มีการไม่เห็นชอบ **กรุณากดปุ้มไม่เห็นด้วย** ผู้ใดควรงดออกเสียง **กรุณากดปุ่มงดออกเสียง**`)
                .setColor(EMBEDS.COLORS)
                .setFooter({ text: EMBEDS.FOOTER.TEXT, iconURL: EMBEDS.FOOTER.ICON })
                .setTimestamp();

            const approveButton = new ButtonBuilder()
                .setCustomId(`approve_${motionTitle}`)
                .setLabel('เห็นด้วย')
                .setStyle(ButtonStyle.Success);

            const disapproveButton = new ButtonBuilder()
                .setCustomId(`disapprove_${motionTitle}`)
                .setLabel('ไม่เห็นด้วย')
                .setStyle(ButtonStyle.Danger);

            const abstainButton = new ButtonBuilder()
                .setCustomId(`abstain_${motionTitle}`)
                .setLabel('งดออกเสียง')
                .setStyle(ButtonStyle.Secondary);

            const row = new ActionRowBuilder()
                .addComponents(approveButton, disapproveButton, abstainButton);

            const sendvotes = new EmbedBuilder()
                .setTitle(`ระบบการลงมติถูกส่งไปยังแชทส่วนตัวของท่านสมาชิกเรียบร้อยแล้ว`)
                .setColor(EMBEDS.COLORS)
                .setFooter({ text: EMBEDS.FOOTER.TEXT, iconURL: EMBEDS.FOOTER.ICON });

            await interaction.reply({
                embeds: [sendvotes],
                ephemeral: true
            });

            const user = interaction.user;
            const dmChannel = await user.createDM();
            await dmChannel.send({ embeds: [motionEmbed], components: [row] });

            const timeInMillis = convertToMilliseconds(duration);

            const filter = i => i.customId.startsWith('approve_') || i.customId.startsWith('disapprove_') || i.customId.startsWith('abstain_');
            const collector = dmChannel.createMessageComponentCollector({ filter, time: timeInMillis });

            collector.on('collect', async i => {
                const voteType = i.customId.split('_')[0];
                const userId = i.user.id;

                if (voteData[motionTitle].hasVoted[userId]) {
                    const voted_already = new EmbedBuilder()
                        .setTitle(`ท่านสมาชิกได้ลงมติไปแล้ว ไม่สามารถลงซ้ำได้`)
                        .setColor(EMBEDS.COLORS)
                        .setFooter({ text: EMBEDS.FOOTER.TEXT, iconURL: EMBEDS.FOOTER.ICON });
                    await i.reply({ embeds: [voted_already], ephemeral: true });
                    return;
                }

                const voted = new EmbedBuilder()
                    .setTitle(`ท่านสมาชิกได้ลงมติ ${voteType} แล้ว`)
                    .setColor(EMBEDS.COLORS)
                    .setFooter({ text: EMBEDS.FOOTER.TEXT, iconURL: EMBEDS.FOOTER.ICON });
                await i.reply({ embeds: [voted], ephemeral: true });

                voteData[motionTitle].hasVoted[userId] = true;

                voteData[motionTitle].presence++;

                voteData[motionTitle][voteType]++;

                fs.writeFileSync(filePath, JSON.stringify(voteData, null, 2));

                const disabledRow = new ActionRowBuilder()
                    .addComponents(
                        approveButton.setDisabled(true),
                        disapproveButton.setDisabled(true),
                        abstainButton.setDisabled(true)
                    );

                if (!i.deferred && !i.replied) {
                    await i.update({ components: [disabledRow] });
                }

            });

            function convertToMilliseconds(duration) {
                const match = duration.match(/(\d+)\s*(วินาที|นาที|ชั่วโมง|วัน|seconds|minutes|hours|days)/i);
                if (!match) return null;

                const time = parseInt(match[1]);
                const unit = match[2].toLowerCase().trim();

                let milliseconds;
                switch (unit) {
                    case 'วินาที':
                    case 'seconds':
                        milliseconds = time * 1000;
                        break;
                    case 'นาที':
                    case 'minutes':
                        milliseconds = time * 60000;
                        break;
                    case 'ชั่วโมง':
                    case 'hours':
                        milliseconds = time * 3600000;
                        break;
                    case 'วัน':
                    case 'days':
                        milliseconds = time * 86400000;
                        break;
                    default:
                        milliseconds = 0;
                        break;
                }
                return milliseconds;
            }

            collector.on('end', async collected => {
                const rawData = fs.readFileSync(filePath);
                const voteData = JSON.parse(rawData);

                const motionTitle = voteData["poll-title"];

                const resultsEmbed = new EmbedBuilder()
                    .setAuthor({ name: `ผลการลงมติ: ${motionTitle}`, iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Seal_of_the_Parliament_of_Thailand.svg/170px-Seal_of_the_Parliament_of_Thailand.svg.png' })
                    .addFields(
                        { name: 'จำนวนผู้ลงมติ', value: `${voteData[motionTitle].presence}`, inline: false },
                        { name: 'เห็นชอบ', value: `${voteData[motionTitle].approve}`, inline: false },
                        { name: 'ไม่เห็นชอบ', value: `${voteData[motionTitle].disapprove}`, inline: false },
                        { name: 'งดออกเสียง', value: `${voteData[motionTitle].abstain}`, inline: false }
                    )
                    .setFooter({ text: EMBEDS.FOOTER.TEXT, iconURL: EMBEDS.FOOTER.ICON })
                    .setColor(EMBEDS.COLORS)
                    .setTimestamp();

                await interaction.channel.send({ embeds: [resultsEmbed] });

                if (voteData.messageId) {
                    const channel = await client.channels.fetch(interaction.channel.id);
                    const message = await channel.messages.fetch(voteData.messageId);
                    if (message) {
                        await message.delete();
                    }
                }
            });

        } catch (error) {
            console.error('Error executing appear command:', error);
            const appear_error = new EmbedBuilder()
                .setTitle(`ท่านสมาชิกครับ ระบบเกิดข้อผิดพลาดอย่างไม่ทราบสาเหตุครับ`)
                .setColor(EMBEDS.COLORS)
                .setFooter({ text: EMBEDS.FOOTER.TEXT, iconURL: EMBEDS.FOOTER.ICON });
            await interaction.reply({ embeds: [appear_error], ephemeral: true });
        }
    },
};
