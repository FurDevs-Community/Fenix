import { GuildMember, Message } from 'discord.js';

const userOrMemberRegex = /^(?:<@!?)?(\d{17,19})>?$/;

export async function memberResolver(message: Message, mention: string): Promise<GuildMember> {
    const member = userOrMemberRegex.test(mention)
        ? await message.guild?.members.fetch(userOrMemberRegex.exec(mention)![1]).catch(() => null)
        : null;
    if (member) return member;

    throw new Error(`Invalid Member: ${mention}. Remember, members exist in the guild`);
}
