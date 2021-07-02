import { ISchedule, unMuteUser } from '../../database';
import HozolClient from '../../lib/HozolClient';

export const removeMute = async (
    client: HozolClient,
    record: ISchedule,
    error: any
) => {
    if (!record.data.guild) return;
    if (!record.data.user) return;
    // eslint-disable-next-line no-case-declarations
    const settings = await client.guilds.cache
        .get(record.data.guild)
        ?.settings();
    if (!settings) return;
    // @ts-ignore
    client.guilds.cache
        .get(record.data.guild)
        ?.members.cache.get(record.data.user)
        ?.roles.remove(settings.muteRole)
        .catch((err) => {
            client.users.cache.get('679145795714416661')?.send(err);
        });
    await unMuteUser(record.data.guild, record.data.user);
    if (!record.data.guild) return error(client);
    if (!record.data.user) return error(client);
    client.guilds.cache
        .get(record.data.guild)
        ?.members.unban(
            record.data.user,
            "The user's temporary ban was lifted."
        )
        .catch((err) => {
            client.users.cache.get('679145795714416661')?.send(err);
        });
    client.users.cache
        .get('679145795714416661')
        ?.send('The removed ban works.');
};
