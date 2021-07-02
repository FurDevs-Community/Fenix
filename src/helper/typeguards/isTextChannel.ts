import { Channel, TextChannel } from 'discord.js';

export function checkTextChannel(channel: Channel): channel is TextChannel {
    return channel.type === 'text';
}
