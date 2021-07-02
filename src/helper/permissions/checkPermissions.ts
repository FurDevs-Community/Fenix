import { Message, PermissionResolvable } from 'discord.js';

export const checkPermissions = (
    message: Message,
    permission: PermissionResolvable[]
) => {
    if (!message.member) return;
    permission.every((perm) => {
        if (message.member?.hasPermission(permission)) {
            return true;
        } else {
            return false;
        }
    });
};
