import { CategoryChannel, GuildChannel } from 'discord.js';

export function checkCategoryChannel(
    channel: GuildChannel
): channel is CategoryChannel {
    return channel.type === 'category';
}
