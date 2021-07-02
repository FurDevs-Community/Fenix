import { Message } from 'discord.js';
import { devs } from './../../settings';

export const checkBotDev = (message: Message) => {
    if (!devs.includes(message.author.id)) {
        throw new Error(`This command may only be used by the bot developers`);
    }
};
