import HozolClient from '../lib/HozolClient';
import { Guild, MessageEmbed, Structures } from 'discord.js';
import {
    IAntiRaid,
    IAntiSpam,
    IAutoModeration,
    IGuild,
    IModeration,
    IRules,
} from '../database/';
import * as db from './../database/index';
import { dashboardBaseURL, defaultPrefix, primaryColor } from '../settings';

declare module 'discord.js' {
    export interface Guild {
        antiraid(): Promise<IAntiRaid>;
        antispam(): Promise<IAntiSpam>;
        rules(): Promise<IRules>;
        moderation(): Promise<IModeration>;
        settings(): Promise<IGuild>;
        automoderation(): Promise<IAutoModeration>;
    }
}

// Guilds
Structures.extend('Guild', (Guild) => {
    // eslint-disable-next-line require-jsdoc
    class HozolGuild extends Guild {
        /**
         * @param {HozolClient} client
         * @param {object} data
         */
        constructor(client: HozolClient, data: object) {
            super(client, data);
            db.findOrCreateGuilds(this.id).then((result) =>
                sendGuildMessage(this, result)
            );
            db.findOrCreateAntiRaid(this.id).then((r: any) => {});
            db.findOrCreateAntiSpam(this.id).then((r: any) => {});
            db.findOrCreateAutoModeration(this.id).then((r: any) => {});
        }

        /**
         * This will show the settings for the guild
         * @return The settings for the guild
         */
        public async settings() {
            return db.findGuild(this.id);
        }

        /**
         * This will show the settings for the guild
         * @return The AntiRaid Settings
         */
        public antiraid() {
            return db.findAntiRaid(this.id);
        }

        /**
         *
         * @return {IAntiSpam} The Antispam Settings
         */
        public async antispam() {
            return db.findAntiSpam(this.id);
        }

        /**
         *
         * @return The Rules Settings
         */
        public async rules() {
            return db.findRules(this.id);
        }

        /**
         *
         * @return The Moderation Settings
         */
        public async moderation() {
            return db.findModeration(this.id);
        }

        /**
         *
         * @return The AutoModeration Settings
         */
        public async automoderation() {
            return db.findAutoModeration(this.id);
        }
    }

    return HozolGuild;
});

/**
 * Sends the guild Bot's first message
 * @param guild {Guild}
 * @param result {any[]}
 */
const sendGuildMessage = (guild: Guild, result: any[]) => {
    const wasCreated = result[1];
    if (wasCreated && guild.me) {
        const channel: any = guild.channels.cache
            .sort((a, b) => {
                // Channels without a parent always come first.
                if (!a.parent && b.parent) return -1;
                if (!b.parent && a.parent) return 1;

                // If both channels do not have a parent, use positioning.
                if (!a.parent && !b.parent) return a.position - b.position;

                if (a.parent && b.parent) {
                    // If both channels do have a parent, but the parents are not the same, use position of the parent.
                    if (a.parentID !== b.parentID)
                        return a.parent.position - b.parent.position;

                    // If both channels have the same parent, use inner position.
                    if (a.parentID === b.parentID)
                        return a.position - b.position;
                }

                return 0;
            })
            .find(
                (chan: any) =>
                    chan.type === 'text' &&
                    chan.permissionsFor(guild.me).has('SEND_MESSAGES') &&
                    chan
                        .permissionsFor(guild.roles.everyone)
                        .has('SEND_MESSAGES')
            );
        if (channel) {
            const newGuild = new MessageEmbed()
                .setTitle('Thank you for adding me!')
                .setDescription(
                    "Hello There! I'm Hozol, A General Purpose Discord Bot! Hmm... you're new to Hozol, aren'tcha? Golly, you must be so excited. Someone ought to teach you how things work around here. I guess little old me will have to do!"
                )
                .setURL(`${dashboardBaseURL}/setup`)
                .addField(
                    'Getting Started',
                    `To get started setting me up, click the title link to read or [here](${dashboardBaseURL}/setup) the getting started guide!`
                )
                .addField(
                    'Commands / Prefix',
                    `My default prefix is **${defaultPrefix}**. You can change it with **${defaultPrefix}prefix**.`
                )
                .setColor(primaryColor)
                .setThumbnail(`${dashboardBaseURL}/images/setup/welcome.png`)
                .setTimestamp();
            channel.send(newGuild).catch(() => {});
        }
    }
};
