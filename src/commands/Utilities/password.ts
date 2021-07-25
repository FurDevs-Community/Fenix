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
            name: 'password',
            category: 'Utilities',
            runIn: ['text', 'dm'],
            aliases: ['pw', 'passgen', 'passwordgen', 'pass'],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
            description: 'Generates a Random password.',
            enabled: true,
            extendedHelp: 'Generates a Random password.',
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
        let length = 8;
        if (args[0] && !isNaN(parseInt(args[0]))) {
            length = parseInt(args[0]) || 0;
        }
        const characters = ['abcdefghijklmnopqrstuvwxyz', '!@#$%^&*()_+~`|}{[]:;?><,./-=', '1234567890'];
        const pass = [];

        for (let i = 0; i < length; i++) {
            const type = characters[Math.floor(Math.random() * characters.length)];
            pass.push(type.split('')[Math.floor(Math.random() * type.split('').length)]);
        }

        message.author.send(
            `🔑 Generated a Password for you ||${pass.join('')}|| ${
                args[0]
                    ? ''
                    : '\nIf you would like a smaller/larger password you can specify how long you would like it to be'
            }`
        );
    }
};
