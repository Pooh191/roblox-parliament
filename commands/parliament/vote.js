const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { EMBEDS } = require('../../settings/embed.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vote')
        .setDescription('สร้างแบบฟอร์มการลงมติแบบหลายตัวเลือก (ใช้ในการประชุมสภา)')
        .addStringOption(option => option
            .setName('vote-title')
            .setDescription('ชื่อเรื่องที่จะดำเนินการลงมติ')
            .setMaxLength(50)
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('option1')
            .setDescription('Option 1 of 5')
            .setMaxLength(50)
        )
        .addStringOption(option => option
            .setName('option2')
            .setDescription('Option 2 of 5')
            .setMaxLength(50)
        )
        .addStringOption(option => option
            .setName('option3')
            .setDescription('Option 3 of 5')
            .setMaxLength(50)
        )
        .addStringOption(option => option
            .setName('option4')
            .setDescription('Option 4 of 5')
            .setMaxLength(50)
        )
        .addStringOption(option => option
            .setName('option5')
            .setDescription('Option 5 of 5')
            .setMaxLength(50)
        ),
        
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });
        const { channel } = interaction; 
        const options = interaction.options.data;

        let votersend = new EmbedBuilder()
            .setTitle(`ได้สร้างฟอร์มการลงมติเรียบร้อยแล้ว`)
            .setColor("#0055a5")
            .setFooter({ text: EMBEDS.FOOTER.TEXT, iconURL: EMBEDS.FOOTER.ICON });

        const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];

        let voter = new EmbedBuilder()
            .setTitle(`${options[0].value}`) 
            .setColor("#0055a5")
            .setFooter({ text: EMBEDS.FOOTER.TEXT, iconURL: EMBEDS.FOOTER.ICON });

        for (let i = 2; i <= options.length; i++) {
            let emoji = emojis[i - 2];
            let option = options[i - 1]; 
            voter.addFields({
                name: `${emoji} ${option.value}`,
                value: ' '
            });
        }
        
        const message = await channel.send({ embeds: [voter] });

        for (let i = 2; i <= options.length; i++) { 
            let emoji = emojis[i - 2];
            await message.react(emoji);
        }

        await interaction.editReply({ embeds: [votersend] });
    }
};
