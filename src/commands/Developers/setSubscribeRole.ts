import HozolClient from '../../lib/HozolClient';
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import { roleNameResolver } from '../../helper';
import { Clients } from '../../database';
import { primaryColor } from '../../settings';

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
        const embed = new MessageEmbed()
            .setTitle('Subscriber is set')
            .addField('Role has been set', `Subscribe Role: ${subscribeRole.name}`)
            .setColor(primaryColor)
            .setTimestamp()
            .setFooter(`User ID: ${message.author.id}`);
        message.channel.send(embed);
    }
};
