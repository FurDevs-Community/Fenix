import HozolClient from '../lib/HozolClient';
import { Guild } from 'discord.js';

import { Event } from 'nukejs';
import { Clients as Client } from '../database/';

module.exports = class extends Event {
    constructor() {
        super({
            name: 'guildCreate',
            enabled: true,
        });
    }

    async run(guild: Guild) {
        const client = <HozolClient>guild.client;
        const clientSettings = await Client.findOne({ id: 1 });
        // Kick self if the guild is black listed
        if (!guild.available) return;
        if (clientSettings?.blacklisted.includes(guild.id)) {
            guild.leave();
            client.warn(
                `Blacklisted guild detected: ${guild.name} [${guild.id}]. Bot left.`
            );
            // TODO: Make it so when it comes to blacklisted guilds, it'll send an embed to the support server
        } else {
            client.log(`${client.log} Bot joined a server`);
        }
    }
};
