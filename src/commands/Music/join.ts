import HozolClient from '../../lib/HozolClient';
import { Message } from 'discord.js';
import { Command } from 'nukejs';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'join',
            category: 'Music',
            runIn: ['text'],
            aliases: [],
            botPerms: ['CONNECT', 'SPEAK'],
            description: 'Join a VC Channel',
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
        if (!message.guild || !message.member) return;
        message.delete();
        const vc = await message.member.voice;
        if (!vc.channel)
            throw new Error('I cannot find the VC Channel, does the bot has permission to see that channe');
        if (!vc) throw new Error("Please make sure you're in a voice channel");
        if (
            !vc.channel.permissionsFor(client.user!)?.has('CONNECT') &&
            !vc.channel.permissionsFor(client.user!)?.has('SPEAK')
        ) {
            throw new Error("I don't have permission to conntect nor speak in this voice channel");
        }

        await vc.channel?.join();
    }
};
