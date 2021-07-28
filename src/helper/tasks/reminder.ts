import { ISchedule } from '../../database';
import HozolClient from '../../lib/HozolClient';

export const task = async (client: HozolClient, record: ISchedule) => {
    if (!record) return;
    const guild = client.guilds.cache.get(record.data.guild);
    if (!guild) return;
    const member = guild?.members.cache.get(record.data.user);
    if (!member) return;
    const reminder = client.guilds.cache.get(record.data.user);
    if (!reminder) return;
    if (member) {
        member.send(`☑️ Heya, ${member.user.username} you told me to remind to you ${reminder}`);
    }
    return;
};
