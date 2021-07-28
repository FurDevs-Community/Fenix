import { ISchedule, unMuteUser } from '../../database';
import HozolClient from '../../lib/HozolClient';

export const task = async (client: HozolClient, record: ISchedule) => {
    if (!record) return;
    const guild = client.guilds.cache.get(record.data.guild);
    if (!guild) return;
    const member = guild?.members.cache.get(record.data.user);
    if (!member) return;
    const settings = await guild.settings();
    if (!settings) return;
    member.roles.remove(settings.muteRole);
    await unMuteUser(record.data.guild, record.data.user);
    guild.members.unban(record.data.user, "The user's temporary ban was lifted.");
};
