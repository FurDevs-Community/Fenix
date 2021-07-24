import HozolClient from '../../lib/HozolClient';
import { Emoji } from 'discord.js';

const emojiRegex = /^(?:<a?:\w{2,32}:)?(\d{17,19})>?$/;

export async function emojiResolver(client: HozolClient, mention: string): Promise<Emoji> {
    const emoji = emojiRegex.test(mention)
        ? // @ts-ignore
          client.emojis.resolve(emojiRegex.exec(mention))
        : null;
    if (emoji) return emoji;
    throw new Error(`Invalid Emoji: ${mention}`);
}
