import HozolClient from '../../lib/HozolClient';
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import { primaryColor } from '../../settings';
import fetch from 'node-fetch';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'meme',
            category: 'Fun',
            runIn: ['text'],
            aliases: [],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
            description: 'Get a random meme.',
            enabled: true,
            extendedHelp: 'Get a random meme.',
            usage: '',
        });
    }

    /**
     * @param {Message} message
     * @param {string[]} args
     * @param {HozolClient} client
     */
    async run(message: Message, args: string[], client: HozolClient) {
        let meme;
        try {
            do {
                meme = await fetchMeme();
            } while (meme.nsfw);
            const embed = new MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTitle(meme.title)
                .setImage(meme.url)
                .setURL(meme.postLink)
                .setColor(primaryColor)
                .setTimestamp()
                .setFooter(`Upvotes: ${meme.ups} | User ID: ${message.author.id}`);
            message.channel.send(embed);
        } catch (e) {
            throw new Error('There was an error trying to get the meme try again later' + e);
        }
    }
};

const fetchMeme = async () => {
    const res = await fetch('https://meme-api.herokuapp.com/gimme');
    const meme = await res.json();

    return meme;
};
