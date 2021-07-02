import { Channel } from 'discord.js';
import HozolClient from '../../lib/HozolClient';

const channelRegex = /^(?:<#)?(\d{17,19})>?$/;

export async function channelResolver(
    client: HozolClient,
    mention: string
): Promise<Channel | null | undefined> {
    // Regular Channel support
    const channel = channelRegex.test(mention)
        ? await client.channels
              .fetch(channelRegex.exec(mention)![1])
              .catch(() => null)
        : null;
    if (channel) return channel;
}
