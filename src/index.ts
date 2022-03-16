import { Partials } from 'discord.js';
import * as dotenv from 'dotenv';
import FenixClient from './lib/FenixClient';
dotenv.config();

// Initalizes a client variable using the FenixClient
const client = new FenixClient({
    intents: 32767,
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Message,
        Partials.Reaction,
        Partials.ThreadMember,
        Partials.User,
    ],
});
// Prevents the bot from crashing
process.on('uncaughtException', async (e) => {
    console.error(e instanceof Error ? `${e.message}\n${e.stack}` : (e as string));
});

// Prevents the bot from crashing
process.on('unhandledRejection', async (e) => {
    console.error(e instanceof Error ? `${e.message}\n${e.stack}` : (e as string));
});

client.login(process.env.TOKEN as string);
