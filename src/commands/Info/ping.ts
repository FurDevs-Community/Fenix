import { Message } from 'discord.js';
import FenixClient from '../../lib/FenixClient';
import BaseCommand from '../../structures/BaseCommand';

export default class PingCommand extends BaseCommand {
    constructor(client: FenixClient) {
        super(client, {
            name: 'ping',
            botPermissions: ['SendMessages', 'EmbedLinks'],
            category: 'Information',
            description: "Pings the bot and gives you the bot's latency",
            examples: [],
            userPermissions: [],
            aliases: [],
        });
    }

    async run(message: Message<boolean>, args: string[]) {
        message.channel.send('pong');
    }
}
