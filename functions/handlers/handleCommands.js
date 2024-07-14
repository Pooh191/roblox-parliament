module.exports = (client) => {
    client.handleCommands = async () => {
        const logger = require("../../lib/logger.js"); // Use correct relative path
        const fs = require('fs');
        const { REST } = require('@discordjs/rest');
        const { Routes } = require('discord-api-types/v10');
        const { TOKEN, CLIENT_ID, GULID_ID } = require(`../../settings/config.js`);
        const commandFolders = fs.readdirSync('./commands');
        let names = [];


        for (const folder of commandFolders) {
            const commandFiles = fs
                .readdirSync(`./commands/${folder}`)
                .filter((file) => file.endsWith(".js"));

            const { commands, commandArray } = client;
            for (const file of commandFiles) {
                const command = require(`../../commands/${folder}/${file}`);
                commands.set(command.data.name, command,);
                commandArray.push(command.data.toJSON());
                names.push(`${command.data.name}`);
            }
        }

        const rest = new REST({ version: '10' }).setToken(TOKEN);

        try {

            logger.info("Started load applicationGuidCommands (/) commands.");

            await rest.put(Routes.applicationCommands(CLIENT_ID, GULID_ID), {
                body: client.commandArray,
            });

        } catch (error) {
            logger.error(error);
        }
    };
};