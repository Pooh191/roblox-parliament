const { ActivityType } = require('discord.js');
const logger = require("../../lib/logger.js"); // Use correct relative path

module.exports = {
    name: 'ready',
    async execute(interaction, client) {
        logger.info(`${client.user.tag} Login Successfully`);

        const activities = [
            { name: `กำลังปรับปรุงพัฒนา`, type: ActivityType.Listening},
        ];

        setInterval(() => {
            const randomActivity = activities[Math.floor(Math.random() * activities.length)];

            client.user.setPresence({
                activities: [randomActivity],
                status: 'online',
            });
        }, 15000);

    },
};
