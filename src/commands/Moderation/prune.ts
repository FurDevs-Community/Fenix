/* eslint-disable require-jsdoc */
import HozolClient from '../../lib/HozolClient';
import { Collection, Message, MessageEmbed } from 'discord.js';

import { Command } from 'nukejs';
import { checkTextChannel } from './../../helper';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'prune',
            category: 'Moderation',
            runIn: ['text'],
            aliases: ['purge', 'clear'],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_CHANNELS'],
            userPerms: ['MANAGE_MESSAGES'],
            description:
                'Discord Staff Command to create a private text channel between staff member and member(s)',
            enabled: true,
            extendedHelp:
                'Discord Staff Command to create a private text channel between staff member and member(s).',
            usage: '',
        });
    }

    /**
     * @param {Message} message
     * @param {string[]} args
     * @param {HozolClient} client
     */
    async run(message: Message, args: string[], client: HozolClient) {
        await message.delete();

        const count = args[0];
        if (count) {
            if (parseInt(count) === 0 || parseInt(count) > 1000) {
                throw new Error(
                    "Please provide a number that's Between 0 and 1000"
                );
            }
        }

        const filter = args[1];

        // Initialize
        const embed1 = new MessageEmbed()
            .setAuthor(
                `${message.author.tag}`,
                `${message.author.displayAvatarURL({ dynamic: true })}`
            )
            .setColor('BLUE')
            .setTitle('Prune - Pruning...')
            .setTimestamp()
            .setFooter(`User ID: ${message.author.id}`)
            .setDescription('This may take a bit...');
        const msg = await message.channel.send(embed1);

        // Prune
        const errors: any = await process(client, message, count, filter);

        // Edit with complete message
        const embed2 = new MessageEmbed()
            .setAuthor(
                `${message.author.tag}`,
                `${message.author.displayAvatarURL({ dynamic: true })}`
            )
            .setTitle('Prune - Messages Pruned!')
            .setTimestamp()
            .setColor(errors > 0 ? 'YELLOW' : 'GREEN')
            .setDescription(`${count} messages have been pruned!`)
            .setFooter(`User ID: ${message.author.id} | Errors: ${errors}`);
        return (await msg.edit(embed2)).delete({ timeout: 15000 });
    }
}

function getFilter(
    client: HozolClient,
    message: Message,
    filter: string,
    user: any
) {
    switch (filter) {
        // Here we use Regex to check for the diffrent types of prune options
        case 'link':
            return (mes: Message) =>
                /https?:\/\/[^ /.]+\.[^ /.]+/.test(mes.content);
        case 'invite':
            return (mes: Message) =>
                /(https?:\/\/)?(www\.)?(discord\.(gg|li|me|io)|discord\.com\/invite)\/.+/.test(
                    mes.content
                );
        case 'bots':
            return (mes: Message) => mes.author.bot;
        case 'you':
            return (mes: Message) => mes.author.id === client.user?.id;
        case 'me':
            return (mes: Message) => mes.author.id === message.author.id;
        case 'upload':
            return (mes: Message) => mes.attachments.size > 0;
        case 'user':
            return (mes: Message) => mes.author.id === user.id;
        case 'noupload':
            return (mes: Message) => mes.attachments.size === 0;
        default:
            return () => true;
    }
}

// Main process function for executing the prunes in iteration until done.
function process(
    client: HozolClient,
    message: Message,
    limit: any,
    filter: string
) {
    return new Promise((resolve) => {
        let iteration = 0;
        let before = message.id;
        let errors = 0;
        // eslint-disable-next-line no-var
        var fn = () => {
            // @ts-ignore
            _process(client, message, limit, filter, before).then(
                (filtered: any) => {
                    errors += filtered[2];
                    if (filtered[0] <= 0) limit = -1;
                    // @ts-ignore
                    before = filtered[1];
                    limit -= filtered[0];
                    iteration++;

                    if (limit > 0 && iteration < 10) {
                        setTimeout(() => {
                            fn();
                        }, 1000);
                    } else {
                        return resolve(errors);
                    }
                }
            );
        };
        fn();
    });
}

// An iteration of pruning
async function _process(
    client: HozolClient,
    message: Message,
    amount: number,
    filter: string,
    before: any
) {
    const mID: any[] = [];
    let errors = 0;
    let messages: Collection<string, Message> =
        await message.channel.messages.fetch({
            limit: 100,
            before: before,
        });
    if (messages.array().length <= 0) return [-1];
    before = messages.lastKey();
    if (filter) {
        const user = typeof filter !== 'string' ? filter : null;
        const type = typeof filter === 'string' ? filter : 'user';
        messages = messages.filter(getFilter(client, message, type, user));
    }
    // @ts-ignore
    messages = messages.array().slice(0, amount);
    const maps = messages.map(async (msg: Message) => {
        try {
            await mID.push(msg.id);
        } catch (e) {
            errors++;
        }
    });
    await Promise.all(maps);
    if (!checkTextChannel(message.channel)) return;
    message.channel.bulkDelete(mID);
    // @ts-ignore
    return [messages.length, before, errors];
}
