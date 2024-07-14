const { EmbedBuilder } = require('discord.js');
const logger = require("../../lib/logger.js"); // Use correct relative path

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const { commands } = client;
            const { commandName } = interaction;
            const command = commands.get(commandName);
            if (!command) return;

            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(error)
                
                const channel = interaction.channel;

                const ErrorEmbed = new EmbedBuilder()
                .setTitle('ระบบการแจ้งเตือน')
                .setColor("Red")
                .setDescription('มีข้อผิดพลาดเกิดขึ้นในระบบ กรุณาลองอีกครั้งหลังจากทำการรีบูตเสร็จสิ้น (กรุณาติดต่อทีมสนับสนุนเพื่อรับการช่วยเหลือในการแก้ไขปัญหา)');
                await channel.send({ embeds: [ErrorEmbed] });

                process.exit(1);
            }
        } else if (interaction.isButton()) {
            const { buttons } = client;
            const { customId } = interaction;
            const button = buttons.get(customId);
            if (!button) return new Error('No Buttons');

            try {
                await button.execute(interaction, client);

            } catch (err) {
                console.error(err);
            }
        }
    },
}