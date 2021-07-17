import HozolClient from '../../lib/HozolClient';
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import { primaryColor, supportServerInvite } from '../../settings';
import { MessageButton } from 'discord-buttons';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'bug',
            category: 'Support',
            runIn: ['text'],
            aliases: [],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
            cooldown: 5,
            description: 'Report a bug about Hozol',
            enabled: true,
        });
    }

    /**
     * @param {Message} message
     * @param {string[]} args
     * @param {HozolClient} client
     */
    async run(message: Message, args: string[], client: HozolClient) {
        const githubButton = new MessageButton()
            .setStyle('url')
            .setLabel('Make an Bug Report')
            .setURL(
                'https://github.com/VulpoTheDev/Hozol/issues/new?assignees=VulpoTheDev&labels=bug&template=bug_report.md&title=%5BBug%5D'
            )
            .setEmoji('865700094162370560');
        const embed = new MessageEmbed()
            .setTitle('Bug Report!?')
            .setDescription(
                `Oops a bug snuck into the Bot!? THIS IS WHY WE DON'T HAVE NICE THINGS >:C\nGo ahead and go to [https://github.com/VulpoTheDev/Hozol](https://github.com/VulpoTheDev/Hozol) and an **bug report** and fill in the issue with the relevant information and the dev team will take a look. While you're at it go ahead and join our support server ${supportServerInvite}`
            )
            .setColor(primaryColor)
            .setTimestamp()
            .setFooter(`User ID ${message.author.id}`);
        await message.channel.send('', {
            button: githubButton,
            embed: embed,
        });
    }
};
