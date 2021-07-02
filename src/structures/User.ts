/* eslint-disable require-jsdoc */
import HozolClient from '../lib/HozolClient';
import { Snowflake, Structures } from 'discord.js';
import {
    findMemberModeration,
    findOneMemberProfile,
    findOneMemberSettings,
    IMember,
    IModeration,
    IProfile,
} from '../database';

declare module 'discord.js' {
    // eslint-disable-next-line no-unused-vars
    interface User {
        guildSettings(guildID: Snowflake): Promise<IMember>;
        guildProfile(guildID: Snowflake): Promise<IProfile>;
        guildModeration(guildID: Snowflake): Promise<IModeration[]>;
    }
}

// Users (MUST be included with GuildMember, or these properties cannot be accessed once someone leaves the guild)
Structures.extend('User', (User) => {
    class HozolUser extends User {
        constructor(client: HozolClient, data: object) {
            super(client, data);
        }

        public guildSettings(guildID: Snowflake): Promise<IMember> {
            return findOneMemberSettings(guildID, this.id);
        }

        public guildProfile(guildID: Snowflake): Promise<IProfile> {
            return findOneMemberProfile(guildID, this.id);
        }

        public guildModeration(guildID: Snowflake): Promise<IModeration[]> {
            return findMemberModeration(guildID, this.id);
        }
    }

    return HozolUser;
});
