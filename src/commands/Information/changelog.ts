import HozolClient from '../../lib/HozolClient';
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import changelogParser from 'changelog-parser';
import { primaryColor } from '../../settings';
const pjson = require('../../../package.json');

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'changelog',
            category: 'Information',
            runIn: ['text', 'dm'],
            aliases: ['latency'],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
            description: 'Get a list of changes made with Hozol.',
            enabled: true,
            extendedHelp: 'Get a list of what has been added, removed or updated with Hozol.',
            usage: '',
        });
    }

    /**
     * @param {Message} message
     * @param {string[]} args
     * @param {HozolClient} client
     */
    async run(message: Message, args: string[], client: HozolClient) {
        await message.delete();
        changelogParser('CHANGELOG.md')
            .then(async (result: any) => {
                if (result.versions && result.versions[0] && result.versions[0].parsed) {
                    // Construct embed
                    const changelog = new MessageEmbed()
                        .setAuthor(
                            `${message.author.tag}`,
                            `${message.author.displayAvatarURL({
                                dynamic: true,
                            })}`
                        )
                        .setFooter(`User ID: ${message.author.id}`)
                        .setTitle(`Changelog - Current bot version is ${pjson.version}`)
                        .setColor(primaryColor)
                        .setTimestamp();

                    // Only get the most recent changes on the changelog
                    const version = result.versions[0];
                    changelog.setDescription(`The following changelog is for version ${version.title}`);
                    for (const key in version.parsed) {
                        if (Object.prototype.hasOwnProperty.call(version.parsed, key) && key !== '_') {
                            changelog.addField(
                                key,
                                version.parsed[key].map((data: string) => `🔹 ${data}`).join(`
                    `)
                            );
                        }
                    }

                    // Send embed
                    await message.channel.send(changelog);
                } else {
                    throw new Error(
                        'The changelog is not formatted properly; header 2s must begin with the version number and must contain proper Added/Changed/Deprecated/Removed header 3s with lists.'
                    );
                }
            })
            .catch(function (err: any) {
                // Whoops, something went wrong!
                throw err;
            });
    }
};
