import { MessageEmbed, TextChannel } from 'discord.js';
import HozolClient from '../../lib/HozolClient';
import { primaryColor } from '../../settings';

export const voteEnd = async (
    client: HozolClient,
    guild: string,
    message: string,
    channel: string
) => {
    const voteChannel = client.guilds.cache
        .get(guild)!
        .channels.cache.get(channel) as TextChannel;
    const msg = await voteChannel.messages.fetch(message);
    const embed = new MessageEmbed()
        .setTitle('Vote Ended')
        .setColor(primaryColor)
        .setFooter(`Vote Ended`);
    if (msg) {
        const yay = (msg.reactions.cache.get('✅')?.count as number) - 1 || 0;
        const nay = (msg.reactions.cache.get('❌')?.count as number) - 1 || 0;
        embed.addField('Votes Yes', yay, true);
        embed.addField('Votes No', nay, true);
        await msg.edit({ embed: embed });
        return;
    }
    return;
};
