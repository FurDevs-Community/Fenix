import HozolClient from '../../lib/HozolClient';
import { User } from 'discord.js';

const userOrMemberRegex = /^(?:<@!?)?(\d{17,19})>?$/;

export async function userResolver(
    client: HozolClient,
    mention: string
): Promise<User> {
    const user = userOrMemberRegex.test(mention)
        ? await client.users
              .fetch(userOrMemberRegex.exec(mention)![1])
              .catch(() => null)
        : null;
    if (user) return user;
    throw new Error(`Invalid user: ${mention}`);
}
