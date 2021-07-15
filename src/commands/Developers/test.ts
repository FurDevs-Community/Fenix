// Imports
import HozolClient from '../../lib/HozolClient';
import { Message } from 'discord.js';
import { Command } from 'nukejs';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'test',
            category: 'Developers',
            runIn: ['text'],
            aliases: [],
            restricted: 'dev',
            enabled: true,
        });
    }

    /**
     * @param {Message} message
     * @param {string[]} args
     * @param {HozolClient} client
     */
    async run(message: Message, args: string[], client: HozolClient) {
        return;
    }
};
