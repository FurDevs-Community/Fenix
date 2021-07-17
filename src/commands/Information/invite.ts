import HozolClient from '../../lib/HozolClient';
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import { primaryColor } from '../../settings';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'invite',
            category: 'Information',
            runIn: ['text'],
            aliases: [],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
            description: "Get the bot's information invite link for the server and the bot itself",
            enabled: true,
            usage: '',
        });
    }

    /**
     * @param {Message} message
     * @param {string[]} args
     * @param {HozolClient} client
     */
    async run(message: Message, args: string[], client: HozolClient) {
        if (!message.guild) return;
        await message.delete();
        const link = await client.generateInvite(4294967287);
        const embed = new MessageEmbed()
            .setAuthor(
                message.author.tag,
                message.author.avatarURL({ dynamic: true }) ||
                    message.guild.iconURL({ dynamic: true }) ||
                    ''
            )
            .addField(`Support Server Link`, 'https://discord.gg/R49nqt2k3g')
            .addField(`Bot Invitation Link`, link)
            .setColor(primaryColor);
        await message.channel.send(embed);
    }
}
