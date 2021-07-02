import { Channel, DMChannel } from 'discord.js';

export function checkDMChannel(channel: Channel): channel is DMChannel {
    return channel.type === 'dm';
}
