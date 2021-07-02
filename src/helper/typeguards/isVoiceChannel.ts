import { GuildChannel, VoiceChannel } from 'discord.js';

export function checkVoiceChannel(
    channel: GuildChannel
): channel is VoiceChannel {
    return channel.type === 'voice';
}
