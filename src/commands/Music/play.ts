import HozolClient from '../../lib/HozolClient';
import { Message } from 'discord.js';
import { Command } from 'nukejs';
import ytdl from 'ytdl-core';
import ytSearch from 'yt-search';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'play',
            category: 'Music',
            runIn: ['text'],
            aliases: [],
            botPerms: ['CONNECT', 'SPEAK'],
            description: 'Play Music in a voice channel',
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
            throw new Error(
                'I cannot find the VC Channel, does the bot has permission to see that channe'
            );
        if (!vc) throw new Error("Please make sure you're in a voice channel");
        if (
            !vc.channel.permissionsFor(client.user!)?.has('CONNECT') &&
            !vc.channel.permissionsFor(client.user!)?.has('SPEAK')
        ) {
            throw new Error(
                "I don't have permission to conntect nor speak in this voice channel"
            );
        }
        if (!args)
            throw new Error('Please Provide a song you would like me to play');
        const connection = await vc.channel?.join();
        try {
            const videos = (await ytSearch(args.slice(0).join(' '))).all;
            const video = videos.length > 0 ? videos[0] : null;
            if (!video) {
                throw new Error(
                    `There's no video with the search of ${args
                        .slice(0)
                        .join(' ')}`
                );
            }
            const stream = await ytdl(video.url, { filter: 'audioonly' });
            connection.play(stream, { seek: 0, volume: 1 });
        } catch (e) {
            throw new Error(e);
        }
    }
};
