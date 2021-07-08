import HozolClient from '../../lib/HozolClient';
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import fetch from 'node-fetch';
import { primaryColor } from '../../settings';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'viewsuggestions',
            category: 'Support',
            runIn: ['text'],
            aliases: ['vs'],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
            restricted: 'dev',
            description: 'View the list of suggestion in Hozol',
            enabled: true,
        });
    }

    /**
     * @param {Message} message
     * @param {string[]} args
     * @param {HozolClient} client
     */
    async run(message: Message, args: string[], client: HozolClient) {
        const msg = await message.channel.send('Fetching Data... Please Wait');
        const reportEmbed = new MessageEmbed()
            .setTitle('Suggestions in Hozol')
            .setColor(primaryColor)
            .setFooter(`User ID: ${message.channel.id}`);
        const url = `https://api.github.com/search/issues?q=is:issue%20%20state:open%20label:enhancement%20repo:Dracy-Developments/Hozol&access_token=${process.env.GHTOKEN}`;
        const response = await fetch(url);
        const issues = await response.json().catch(() => {
            client.error(
                'WHOOPSIE! NAUGHTY WITTLE VULPIE MADE A FUCKY WUCKY LET ME, NOM HIM'
            );
        });
        if (issues.items.length === 0) {
            reportEmbed.addField(
                'No Suggestion!?!',
                " There's no suggestions found in the GitHub Repository!"
            );
            await msg.delete().catch(() => client.log(''));
            return message.channel.send(reportEmbed);
        } else {
            issues.items.map(
                async (suggestions: { title: any; number: any; body: any }) => {
                    reportEmbed.addField(
                        `${suggestions.title}`,
                        `${suggestions.body}\n[Click to see this suggestion](https://github.com/Dracy-Developments/Hozol/issues/${suggestions.number})`
                    );
                }
            );
            await msg.delete().catch(() => client.log(''));
            return message.channel.send(reportEmbed);
        }
    }
};
