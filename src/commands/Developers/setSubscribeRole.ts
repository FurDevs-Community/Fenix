import HozolClient from '../../lib/HozolClient';
import { Message } from 'discord.js';
import { Command } from 'nukejs';
import { roleNameResolver } from '../../helper';
import { Clients } from '../../database';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'setsubscriberole',
            category: 'Developers',
            runIn: ['text'],
            aliases: ['setsubrole'],
            description: 'Set the Subscribe Role for the support sever',
            enabled: true,
            restricted: 'dev',
        });
    }

    /**
     * @param {Message} message
     * @param {string[]} args
     * @param {HozolClient} client
     */
    async run(message: Message, args: string[], client: HozolClient) {
        message.delete();
        const clientData = await Clients.findOne({ id: 1 });
        if (!clientData) throw new Error("Client Data doesn't exist");
        const subscribeRole = await roleNameResolver(message, args.slice(0).join(' '));
        if (subscribeRole) {
            Clients.updateOne({ id: 1 }, { subscribeRole: subscribeRole });
        }
    }
};
