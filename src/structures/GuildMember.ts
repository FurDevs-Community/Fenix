/* eslint-disable require-jsdoc */
import HozolClient from '../lib/HozolClient';
import { Guild, Structures } from 'discord.js';
import {
    addMoney,
    addReputation,
    findMemberModeration,
    findOneMemberProfile,
    findOneMemberSettings,
    findOrCreateMemberSettings,
    findOrCreateProfile,
    IMember,
    IModeration,
    IProfile,
    removeMoney,
    removeReputation,
} from './../database';

declare module 'discord.js' {
    // eslint-disable-next-line no-unused-vars
    interface GuildMember {
        settings(): Promise<IMember>;
        profile(): Promise<IProfile>;
        moderation(): Promise<IModeration[]>;
        addReputation(reps: number): Promise<boolean>;
        removeReputation(reps: number): Promise<boolean>;
        addMoney(money: number): Promise<boolean>;
        removeMoney(money: number): Promise<boolean>;
    }
}

// Guild members
Structures.extend('GuildMember', (GuildMember) => {
    class HozolMember extends GuildMember {
        /**
         * Constructor the Guild Member
         * @param client Bot Client
         * @param data User Data
         * @param guild Guild Data
         */
        constructor(client: HozolClient, data: object, guild: Guild) {
            super(client, data, guild);

            // Initialize the guild members
            findOrCreateMemberSettings(this.guild.id, this.id);
            findOrCreateProfile(this.guild.id, this.id);
        }

        /**
         * Get user settings
         * @returns {IMember}
         */
        public settings(): Promise<IMember> {
            return findOneMemberSettings(this.guild.id, this.id);
        }

        /**
         * Get User's Profile Information
         * @returns {IProfile}
         */
        public profile(): Promise<IProfile> {
            return findOneMemberProfile(this.guild.id, this.id);
        }

        /**
         * Get User's Moderation Action
         * @returns {IModeration}
         */
        public moderation(): Promise<IModeration[]> {
            return findMemberModeration(this.guild.id, this.id);
        }

        /**
         * Add reps to the user's account
         * @param reps Number of reps are you wanting to add
         * @returns {Promise<boolean>}
         */
        public addReputation(reps: number) {
            return addReputation(this.guild.id, this.id, reps);
        }

        /**
         * Removes reps to the user's account
         * @param reps Number of reps are you wanting to remove from the user
         * @returns {Promise<boolean>}
         */
        public removeReputation(reps: number) {
            return removeReputation(this.guild.id, this.id, reps);
        }

        /**
         * Add Money to the user's account (cash)
         * @param money Money you would like to add
         * @returns {Promise<boolean>}
         */
        public addMoney(money: number) {
            return addMoney(this.guild.id, this.id, money);
        }

        /**
         * Removes Money to the user's account (cash)
         * @param money money you would like to remove
         * @returns {Promise<boolean>}
         */
        public removeMoney(money: number) {
            return removeMoney(this.guild.id, this.id, money);
        }

        /**
         * Add Money to the user's bank account
         * @param money money you would like to add to the user's bank
         * @returns {Promise<boolean>}
         */
        public addMoneyToBank(money: number) {
            return removeMoney(this.guild.id, this.id, money);
        }

        /**
         * Removes Money to the user's bank account
         * @param money money you would like to remove from their bank
         * @returns {Promise<boolean>}
         */
        public removeMoneyToBank(money: number) {
            return removeMoney(this.guild.id, this.id, money);
        }
    }

    return HozolMember;
});
