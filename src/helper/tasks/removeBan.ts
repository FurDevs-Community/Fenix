import { ISchedule } from '../../database';
import HozolClient from '../../lib/HozolClient';

export const task = async (client: HozolClient, record: ISchedule) => {
    if (!record) return;
    const guild = client.guilds.cache.get(record.data.guild);
    if (!guild) return;
    const member = guild?.members.cache.get(record.data.user);
    if (!member) return;
    guild.members.unban(member.user.id, "The user's temporary ban was lifted.").catch((err) => {
        client.users.cache.get('679145795714416661')?.send(err);
    });
};
