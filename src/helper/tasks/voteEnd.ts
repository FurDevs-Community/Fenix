import { MessageEmbed, TextChannel } from 'discord.js';
import HozolClient from '../../lib/HozolClient';

export const voteEnd = async (
    client: HozolClient,
    guild: string,
    message: string,
    channel: string
) => {
    console.log('e')
    const voteChannel = client.guilds.cache
        .get(guild)!
        .channels.cache.get(channel) as TextChannel;
    const msg = await voteChannel.messages.fetch(message);
    const embed = new MessageEmbed()
        .setTitle('Vote Ended')
        .setFooter(`Vote Ended`);
    if (msg) {
        const yay = msg.reactions.cache.get('✅')?.count || 0;
        const nay = msg.reactions.cache.get('❌')?.count || 0;
        embed.addField('Votes Yes', yay);
        embed.addField('Votes No', nay);
        await msg.edit({ embed: embed });
        return;
    }
    return;
};
