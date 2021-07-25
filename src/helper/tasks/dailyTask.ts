import { Guild } from 'discord.js';
import { Guilds } from '../../database';
import HozolClient from '../../lib/HozolClient';
import moment from 'moment';

export const dailyTask = async (client: HozolClient, guild: Guild) => {
    const settings = await guild.settings();
    const msgCountHistory = await settings.messagesCountHistory;
    const count: number = settings.messagesSent24hr;
    const day = moment().toISOString();
    const newMsgCountHistory = [...msgCountHistory, { day, count }];
    Guilds.findOneAndUpdate({ guildID: guild.id }, { messagesSent24hr: 0, messagesCountHistory: newMsgCountHistory });
};
