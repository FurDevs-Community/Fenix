import { Message } from 'discord.js';
import { Guilds } from '../../database';

export const incrementMessageCount = async (message: Message) => {
    if (!message.guild) return;
    const { messagesSent24hr } = await message.guild!.settings();
    await Guilds.findOneAndUpdate(
        { guildID: message.guild.id },
        {
            messagesSent24hr: messagesSent24hr + 1,
        }
    );
};
