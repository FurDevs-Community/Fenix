import { Client } from 'nukejs';
import { Message, TextChannel } from 'discord.js';
import { Command } from 'nukejs';
const types = [
    'support',
    'interrogation',
    'discipline',
    'inactive',
    'inquiry',
    'welcome',
];

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: 'close',
            category: 'Moderation',
            runIn: ['text'],
            aliases: [],
            cooldown: 0,
            description: `Close an Incidents Channel`,
            enabled: true,
            ignoredInhibitors: [],
            botPerms: ['MANAGE_CHANNELS'],
            userPerms: ['MANAGE_CHANNELS'],
        });
    }
    /**
     * @param message
     * @param args
     * @param client
     */
    async run(message: Message, args: string[], client: Client) {
        if (
            types.includes((message.channel as TextChannel).name.split('-')[0])
        ) {
            message.channel.send(`Closing Incidents Channel...`);
            await message.channel.delete();
        } else {
            throw new Error('You can only close an incidents channel');
        }
    }
}
