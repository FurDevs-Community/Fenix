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
            name: 'ping',
            category: 'Information',
            runIn: ['text'],
            aliases: ['latency'],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
            description: "Get the bot's latency.",
            enabled: true,
            extendedHelp: "Get the bot's latency.",
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
        const msg = await message.channel.send('Flying...');
        const embed = new MessageEmbed()
            .setAuthor(`${message.author.username}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
            .setTitle('🏓 Pong!')
            .addField('ws/API Latency', `${Math.round(client.ws.ping)}ms`)
            .addField('Message Latency is', `${Date.now() - msg.createdTimestamp}ms`)
            .setColor(primaryColor)
            .setTimestamp()
            .setFooter(`User ID: ${message.author.id}`);
        msg.delete();
        message.channel.send(embed);
    }
};
