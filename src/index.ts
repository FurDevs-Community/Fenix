/* eslint-disable prettier/prettier */
import HozolClient from './lib/HozolClient';
import { MessageEmbed } from 'discord.js';
import * as dotenv from 'dotenv';
import { Clients } from './database';
import { __prod__, defaultPrefix, devs, port, primaryColor } from './settings';
import { api } from './api';
import { cron } from './helper/general/cron';
import discordButton from 'discord-buttons';

dotenv.config();
require('./structures/Guild');
require('./structures/GuildMember');
require('./structures/User');
require('moment-duration-format');

// This initalizes the client
const client = new HozolClient({
    owner: '852070153804972043',
    devIds: [...devs],
    readyMessage: '{username} is now ready!',
    discordOptions: {
        disableMentions: 'everyone',
        messageCacheMaxSize: 10000,
        messageCacheLifetime: 60 * 60 * 24 * 10,
        messageSweepInterval: 60 * 60,
        fetchAllMembers: true,
        partials: ['USER', 'MESSAGE', 'CHANNEL', 'GUILD_MEMBER', 'REACTION'],
        ws: {
            intents: [
                'GUILDS',
                'GUILD_MESSAGES',
                'GUILD_MEMBERS',
                'GUILD_PRESENCES',
                'GUILD_MESSAGE_REACTIONS',
                'GUILD_BANS',
                'GUILD_VOICE_STATES',
            ],
        },
    },
});

discordButton(client);

process.on('unhandledRejection', (e: string) => client.error('unhandledErrorRejection!\n' + e));

// When the bot is ready, then change the status and do a Guild Blacklist Count
client.on('ready', async () => {
    const clientSettings = await Clients.findOne({ id: 1 });
    if (!clientSettings) await Clients.create({ id: 1 });
    await cron(client);
    api(client);
    const embed = new MessageEmbed()
        .setTitle('Hozol is ready!')
        .setColor(primaryColor)
        .addField('Version', require('./../package.json').version)
        .addField('API', __prod__ ? 'https://api.hozol.xyz' : `http://localhost:${port}`)
        .addField('Dashboard', __prod__ ? 'https://hozol.xyz' : `http://localhost:3000`)
        .setThumbnail('https://cdn.discordapp.com/emojis/758388154465517578.png?v=1');
    client.users.cache.get('852070153804972043')?.send(embed);

    // Sets the Status
    client.user?.setActivity({
        name: `My Prefix: ${defaultPrefix}`,
        type: 'WATCHING',
    });

    // FIXME: Figure out how to do this blacklist guild checking while sharding
});
