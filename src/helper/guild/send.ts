/* eslint-disable valid-jsdoc */
import { Guild } from 'discord.js';
import { checkTextChannel } from './../';

/**
 * Sends a message to a specific channel
 *
 * @param type Type of channel the bot should send the content to
 * @param guild The guild of that channel
 * @param content The content of what should be sent to that channel
 * @param options Any message options
 * @return The Message being sent to the specified channel or an error in the console
 * @example await send('banLogChannel', message, 'user said a bad word therefore user's now banned')
 */
export async function send(
    type:
        | 'incidentsCategory'
        | 'banLogChannel'
        | 'kickLogChannel'
        | 'modLogChannel'
        | 'publicModLogChannel'
        | 'joinLogChannel'
        | 'leaveLogChannel'
        | 'autoModLogChannel'
        | 'channelLogChannel'
        | 'messageLogChannel'
        | 'userLogChannel'
        | 'generalChannel'
        | 'announcementsChannel',
    guild: Guild,
    content: string,
    options: object
) {
    if (guild) {
        const settings = await guild.settings();
        if (!settings[type]) return;
        const channel = guild.channels.resolve(settings[type]);
        // TODO: Figure out a way the user can get this message
        if (!channel) {
            return console.error("Tried sending something to channel, but was removed or don't have access to it");
        }
        if (!checkTextChannel(channel)) return;
        return await channel.send(content, options).catch((err) => console.error(err));
    } else {
        throw new Error('This function can be only operated in Guilds');
    }
}
