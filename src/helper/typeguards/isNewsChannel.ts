import { GuildChannel, NewsChannel } from 'discord.js';

export function checkNewsChannel(
    channel: GuildChannel
): channel is NewsChannel {
    return channel.type === 'news';
}
