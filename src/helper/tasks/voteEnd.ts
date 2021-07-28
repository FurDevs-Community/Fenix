import { MessageEmbed, TextChannel } from 'discord.js';
import { ISchedule } from '../../database';
import HozolClient from '../../lib/HozolClient';
import { primaryColor } from '../../settings';

export const task = async (client: HozolClient, record: ISchedule) => {
    const voteChannel = client.guilds.cache
        .get(record.data.guild)!
        .channels.cache.get(record.data.channel!) as TextChannel;
    const msg = await voteChannel.messages.fetch(record.data.messageID!);
    const embed = new MessageEmbed().setTitle('Vote Ended').setColor(primaryColor).setFooter(`Vote Ended`);
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
