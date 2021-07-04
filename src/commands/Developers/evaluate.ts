// Import what is needed to run the Evaluate command
import HozolClient from '../../lib/HozolClient';
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import beautify from 'beautify';
import { primaryColor } from '../../settings';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'eval',
            category: 'Developers',
            runIn: ['text'],
            aliases: ['evaluate', 'e'],
            restricted: 'dev',
            description: 'Evaluate JS Code, Be careful with it!',
            enabled: true,
        });
    }

    /**
     * @param {Message} message
     * @param {string[]} args
     * @param {HozolClient} client
     */
    async run(message: Message, args: string[], client: HozolClient) {
        // Deletes the message
        await message.delete();

        // If no arguments are specified... then throw an error saying to provide code to evaluate
        if (!args[0]) {
            throw new Error(
                'Please Provide JS Code you would like to Evaluate'
            );
        }

        // Takes the arguments and join them to become a string
        const script = args.join(' ');
        if (script.includes('token')) {
            return message.channel.send(
                'https://media.discordapp.net/attachments/623523668923777045/802675248801644544/eject.gif'
            );
        }

        try {
            // Evaluate the script
            // eslint-disable-next-line no-eval
            const evaluated: any = eval(script);
            const evaled = require('util').inspect(evaluated, { depth: 5 });
            // Resolves any promises this eval has
            const promisedEval: any = await Promise.resolve(evaluated);

            let res;
            // If the result of what's eval larger than 1500 characters, then go ahead and make a pastebin
            if (evaled.toString().length >= 1024) {
                await require('hastebin-gen')(evaled, {
                    url: 'https://hastebin.com',
                }).then((result: string) => {
                    res = result;
                });
            } else {
                res = evaled;
            }
            let promisedResult;

            // Do the same thing that we just did with the eval but is a promise
            if (promisedEval.toString().length >= 1024) {
                await require('hastebin-gen')(promisedEval, {
                    url: 'https://hastebin.com/',
                }).then((result: string) => {
                    promisedResult = result;
                });
            } else {
                promisedResult = promisedEval;
            }

            // Process the output
            const embed = new MessageEmbed()
                .setAuthor(
                    `${message.author.tag}`,
                    `${message.author.displayAvatarURL({ dynamic: true })}`
                )
                .setTitle('Evaluate')
                .setColor(primaryColor)
                .setTimestamp()
                .addField(
                    ':inbox_tray: Input: ',
                    `\`\`\`ts\n${beautify(script, { format: 'js' })} \`\`\``
                )

                .addField(':outbox_tray: Output', `\`\`\`ts\n${res}\`\`\``)

                .setFooter(`User ID: ${message.author.id}`)
                .setThumbnail(
                    client.user?.displayAvatarURL({ dynamic: true }) ||
                        'https://avatars.githubusercontent.com/u/40704274?s=460&u=1ef220ad5b4625d67046cb5ec9c080299dc1aa61&v=4'
                );

            // If what is provided a promise then, provide the resolved promise (or link) in the embed
            if (evaluated && evaluated.then) {
                embed.addField(
                    ':outbox_tray: Promise Output',
                    `\`\`\`js\n${promisedResult}\`\`\``
                );
            }

            // Add a type of what is the type of what's evaluated
            embed.addField('Type of: ', `\`\`\`${typeof evaluated}\`\`\``);

            // Sends the embed
            await message.channel.send(embed);
        } catch (err) {
            // If any errors occurred... then, send the error instead
            throw new Error(err);
        }
    }
};
