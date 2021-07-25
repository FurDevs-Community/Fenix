import HozolClient from '../../lib/HozolClient';
import { Message } from 'discord.js';
import { Command } from 'nukejs';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'masschannelcreate',
            category: 'Information',
            runIn: ['text'],
            aliases: ['mcc'],
            botPerms: ['MANAGE_CHANNELS'],
            description: 'Create Channels in Bulk',
            enabled: true,
            usage: '',
            restricted: 'dev',
        });
    }

    /**
     * @param {Message} message
     * @param {string[]} args
     * @param {HozolClient} client
     */
    async run(message: Message, args: string[], client: HozolClient) {
        if (!message.guild) return;
        message.delete();
        if (!args) throw new Error('Please provide args');
        const category = message.guild.channels.cache.get(args[0]);
        if (!(category?.type === 'category')) {
            throw new Error('Please make sure the first argument is a category');
        } else {
            const channelNames = args.slice(1);
            channelNames.forEach((name) => {
                message.guild?.channels.create(name, {
                    parent: category,
                    type: 'text',
                });
            });
        }
    }
};
