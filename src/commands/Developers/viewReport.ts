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
            name: 'viewreports',
            category: 'Support',
            runIn: ['text'],
            aliases: ['vr'],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
            restricted: 'dev',
            description: 'View the list of reports in Hozol',
            enabled: true,
        });
    }

    /**
     * @param {Message} message
     * @param {string[]} args
     * @param {HozolClient} client
     */
    async run(message: Message, args: string[], client: HozolClient) {
        // TODO: If VMod issues starts to ramp up in pace, make the view reports paginated
        // Sends a message saying that it's getting the data
        const msg = await message.channel.send('Fetching Data... Please Wait');
        // This will make an embed but not send it
        const reportEmbed = new MessageEmbed()
            .setTitle('Bugs in Hozol')
            .setColor(primaryColor)
            .setFooter(`User ID: ${message.channel.id}`);
        // This will assign the url repository to the url of the Hozol Repository
        const url = `https://api.github.com/search/issues?q=is:issue%20%20state:open%20label:bug%20repo:Dracy-Developments/Hozol&access_token=${process.env.GHTOKEN}`;
        // This will fetch the data from the repository that relates to open issues with a bug label
        const response = await fetch(url);
        // This will then make a new variable which is the json version of what was fetched
        const issues = await response.json().catch((err) => {
            client.error(
                'WHOOPSIE! NAUGHTY WITTLE DWAGO MADE A FUCKY WUCKY LET ME, NOM HIM\n\n' +
                    err
            );
        });
        // If there is no issues that are open with a bug label then...
        if (issues.items.length === 0) {
            // Add a field saying there's no bugs then send that embed
            reportEmbed.addField(
                '🎉 No Issues',
                " There's no issues found in the GitHub Repository!"
            );
            return message.channel.send(reportEmbed);
        } else {
            // If there is issues that are open with the bug label then map it
            issues.items.map(
                async (report: { title: any; number: any; body: any }) => {
                    // Then for each bug you'll display it as a new field
                    reportEmbed.addField(
                        `${report.title}`,
                        `${report.body}\n[Click to see this issue](https://github.com/Dracy-Developments/Hozol/issues/${report.number})`
                    );
                }
            );
            // Delete the message
            await msg.delete().catch(() => client.log(''));
            // Then return the embed with the bugs
            return message.channel.send(reportEmbed);
        }
    }
}
