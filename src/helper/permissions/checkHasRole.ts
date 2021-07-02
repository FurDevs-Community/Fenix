import { Message } from 'discord.js';

export const checkPermissions = async (
    message: Message,
    roleChecking: 'botManagerRole' | 'botModRole'
) => {
    if (!message.guild || !message.member) return;
    const settings = await message.guild.settings();
    const role = message.guild.roles.cache.get(settings[roleChecking])?.id;
    if (!role) {
        return false;
    } else if (!message.member.roles.cache.has(role)) {
        return false;
    } else {
        return true;
    }
};
