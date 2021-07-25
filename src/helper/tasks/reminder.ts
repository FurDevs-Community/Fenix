import HozolClient from '../../lib/HozolClient';

export const reminder = async (client: HozolClient, guild: string, userID: string, reminder: string) => {
    const getUser = client.guilds.cache.get(guild)!.members.cache.get(userID);
    if (getUser) {
        getUser.send(`☑️ Heya, ${getUser.user.username} you told me to remind to you ${reminder}`);
    }
    return;
};
