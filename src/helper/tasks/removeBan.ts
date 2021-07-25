import { ISchedule } from '../../database';
import HozolClient from '../../lib/HozolClient';

export const removeBan = async (client: HozolClient, record: ISchedule, error: any) => {
    if (!record.data.guild) return error(client);
    if (!record.data.user) return error(client);
    client.guilds.cache
        .get(record.data.guild)
        ?.members.unban(record.data.user, "The user's temporary ban was lifted.")
        .catch((err) => {
            client.users.cache.get('679145795714416661')?.send(err);
        });
    client.users.cache.get('679145795714416661')?.send('The removed ban works.');
};
