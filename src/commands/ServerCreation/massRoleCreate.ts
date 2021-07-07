import HozolClient from '../../lib/HozolClient';
import { Message } from 'discord.js';
import { Command } from 'nukejs';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'massrolelcreate',
            category: 'Information',
            runIn: ['text'],
            aliases: ['mcr'],
            botPerms: ['MANAGE_CHANNELS'],
            description: 'Create Roles in Bulk',
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
        const roles = args.slice(0);
        roles.forEach((role) => {
            message.guild!.roles.create({
                data: {
                    name: role,
                },
            });
        });
    }
};
