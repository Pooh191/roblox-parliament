const fs = require('fs');
const logger = require("../../lib/logger.js"); // Use correct relative path

module.exports = (client) => {
    client.handleEvents = async () => {
        const eventFolders = fs.readdirSync('./events');
        for (const folder of eventFolders) {
            const eventFiles = fs
                .readdirSync(`./events/${folder}`)
                .filter((file) => file.endsWith('.js'));

            switch (folder) {
                case 'client':
                    for (const file of eventFiles) {
                        const event = require(`../../events/${folder}/${file}`);
                        if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
                        else client.on(event.name, (...args) => event.execute(...args, client));
                    }
                    break;

                case 'guild':
                    for (const file of eventFiles) {
                        const event = require(`../../events/${folder}/${file}`);
                        if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
                        else client.on(event.name, (...args) => event.execute(...args, client));
                    }
                    break;

                default:
                    break;
            }
        }
        logger.info('Events are Loaded!');
    };
};
