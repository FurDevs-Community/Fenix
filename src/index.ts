/* eslint-disable prettier/prettier */
import HozolClient from './lib/HozolClient';
import { MessageEmbed } from 'discord.js';
import * as dotenv from 'dotenv';
import { Clients, Schedules } from './database';
import { addSchedule } from './helper/schedules/schedules';
import { defaultPrefix, devs, primaryColor } from './settings';
import { api } from './api';
dotenv.config();
require('./structures/Guild');
require('./structures/GuildMember');
require('./structures/User');
require('moment-duration-format');

// This initalizes the client
const client = new HozolClient({
    eventsFolder: './dist/events',
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
            ],
        },
    },
});

client.moment.tz.setDefault('UTC');
process.on('unhandledRejection', (e: string) => {
    let er;
    if (e.length > 1000) {
        er = require('hastebin-gen')(e, { url: 'drago.probably.booped.me' });
    } else {
        er = e;
    }

    client.users.cache
        .get('679145795714416661')
        ?.send(`An unhandledRejection has happened @.@\n${er}`);
    console.log('Unhandled Rejection has happened!');
    console.log(e);
});

// Connects and Initiates the Database
client.connectDB(process.env.DB);

// Login the bot
client.login(process.env.TOKEN);

// When the bot is ready, then change the status and do a Guild Blacklist Count
client.on('ready', async () => {
    const clientSettings = await Clients.findOne({ id: 1 });
    if (!clientSettings) Clients.create({ id: 1 });
    cron();
    api(client);
    const embed = new MessageEmbed()
        .setTitle('Hozol is ready!')
        .setColor(primaryColor)
        .addField('Version', require('./../package.json').version)
        .setThumbnail(
            'https://cdn.discordapp.com/emojis/758388154465517578.png?v=1'
        );
    client.users.cache.get('679145795714416661')?.send(embed);

    // Sets the Status
    client.user?.setActivity({
        name: `My Prefix: ${defaultPrefix}`,
        type: 'WATCHING',
    });

    // FIXME: Figure out how to do this blacklist guild checking while sharding
});

// If the bot hits ratelimit, Log it into the console
client.on('rateLimit', () => {
    client.error(`Hit Ratelimit!`);
});

client.on(`warn`, (warning) => {
    client.warn(warning);
});

client.on(`debug`, (debug) => {
    client.debug(debug);
});

client.on(`error`, (err) => {
    client.error(err.message);
});

/**
 * This will schedule the tasks that are currently in the database
 */
async function cron() {
    client.debug('Setting Up Schedules');
    const records = await Schedules.find({});
    records.forEach(async (record) => {
        await addSchedule(client, record)
            .then(() => {
                client.debug('Loaded Schedule: ' + record.uid);
            })
            .catch((e) =>
                client.error(
                    'Problem Loading Schedule: ' + record.uid + 'Error:\n' + e
                )
            );
    });

    const SYSMIN = await Schedules.findOne({ uid: `SYS-MIN` });

    if (!SYSMIN) {
        client.warn(`Creating new Minute Task Schdule for the Bot`);
        await Schedules.create({
            uid: `SYS-MIN`,
            task: 'SYSMIN',
            data: {},
            nextRun: client.moment().add(1, 'minute').toISOString(true),
            cron: '0 * * * * *',
        }).then(async (data) => {
            await addSchedule(client, data)
                .then(() => {
                    client.debug('Loaded Schedule: ' + data.uid);
                })
                .catch((e) =>
                    client.error(
                        'Problem Loading Schedule: ' + data.uid + 'Error:\n' + e
                    )
                );
        });
    }

    client.guilds.cache.forEach(async (g) => {
        const statsUpdater = await Schedules.findOne({ uid: `STATS-${g.id}` });
        const minuteTask = await Schedules.findOne({ uid: `MIN-${g.id}` });

        if (!minuteTask) {
            client.warn(`Creating new Minute Task Schdule for ${g.id}`);
            await Schedules.create({
                uid: `MIN-${g.id}`,
                task: 'minuteTask',
                data: {
                    guild: g.id,
                },
                nextRun: client.moment().add(1, 'minute').toISOString(true),
                cron: '0 * * * * *',
            }).then(async (data) => {
                await addSchedule(client, data)
                    .then(() => {
                        client.debug('Loaded Schedule: ' + data.uid);
                    })
                    .catch((e) =>
                        client.error(
                            'Problem Loading Schedule: ' +
                                data.uid +
                                'Error:\n' +
                                e
                        )
                    );
            });
        }

        if (!statsUpdater) {
            await Schedules.create({
                uid: `STATS-${g.id}`,
                task: 'updateStats',
                data: {
                    guild: g.id,
                },
                nextRun: client.moment().add(10, 'minute').toISOString(true),
                cron: '0 */10 * * * *',
            }).then(async (data) => {
                await addSchedule(client, data)
                    .then(() => {
                        client.debug('Loaded Schedule: ' + data.uid);
                    })
                    .catch((e) =>
                        client.error(
                            'Problem Loading Schedule: ' +
                                data.uid +
                                'Error:\n' +
                                e
                        )
                    );
            });
        }
    });
}
