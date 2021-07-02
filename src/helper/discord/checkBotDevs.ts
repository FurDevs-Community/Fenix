import HozolClient from '../../lib/HozolClient';
import { Message } from 'discord.js';

// ! Will be Deprecated once NukeJS has this feature part of the Framework
/**
 * This will check is the user is in the Developer Array
 * @param client The Client
 * @param message The message send by the user
 * @throws An error if the user is not the developer and fails the command
 * @example await checkBotOwner(client, message)
 * @deprecated
 */

// ! Deprecated
export function checkBotOwner(client: HozolClient, message: Message) {
    client.log('This function is used. This function is deprecated.');
    if (!client.developers.includes(message.author.id)) {
        throw new Error('This command may only be used by the bot owner');
    }
}
