import { GuildMember, Message } from 'discord.js';

export function checkPosition(message: Message, member: GuildMember) {
    const botPosition = message.guild?.me?.roles.highest.position;
    const userPosition = member.roles.highest.position;
    const modPosition = message.member?.roles.highest.position;
    if (botPosition! <= userPosition) {
        return [
            false,
            `The bot's highest role (${message.guild?.me?.roles.highest}) must be above the user's highest role (${member.roles.highest}) in order to ban that user`,
        ];
    } else if (modPosition! <= userPosition) {
        return [
            false,
            `Your highest role (${message.member?.roles.highest}) must be higher than the user's highest role (${member.roles.highest}) in order for me to ban that user`,
        ];
    } else {
        return [true, null];
    }
}
