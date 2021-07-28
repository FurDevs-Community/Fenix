import { Guilds, ISchedule } from '../../database';
import HozolClient from '../../lib/HozolClient';
import moment from 'moment';

export const task = async (client: HozolClient, record: ISchedule) => {
    if (!record) return;
    const guild = client.guilds.cache.get(record.data.guild);
    if (!guild) return;
    const settings = await guild.settings();
    const msgCountHistory = await settings.messagesCountHistory;
    const count: number = settings.messagesSent24hr;
    const day = moment().toISOString();
    const newMsgCountHistory = [...msgCountHistory, { day, count }];
    Guilds.findOneAndUpdate({ guildID: guild.id }, { messagesSent24hr: 0, messagesCountHistory: newMsgCountHistory });
};
