import HozolClient from '../../lib/HozolClient';
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import { exec } from 'child_process';
import { primaryColor } from '../../settings';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'exec',
            category: 'Developers',
            runIn: ['text'],
            aliases: ['execute', 'ex'],
            botPerms: ['EMBED_LINKS'],
            restricted: 'dev',
            description: 'Execute things in the terminal!',
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

        // Takes the arguments and join them to become a string
        const script = args.join(' ');

        // If there's no string; Throw an error asking to provide a command to execute
        if (!script) {
            throw new Error('Please provide a command for me to execute');
        }

        // Disallow certain scripts to be ran
        if (
            script.toLowerCase().includes('/.|.&/') ||
            script.toLowerCase().includes('mkdir') ||
            script.toLowerCase().includes('restart') ||
            script.toLowerCase().includes('reboot') ||
            script.toLowerCase().includes('shutdown') ||
            script.toLowerCase().includes('rm')
        ) {
            throw new Error(
                'mkdir, restart, reboot, shutdown, rm, and dot based directory structures are not permitted.'
            );
        }

        // Execute the command

        exec(`${script}`, async (error, stdout) => {
            const response = error || stdout;
            if (
                response.toString().length > 1024 ||
                response.toString().length > 1024
            ) {
                // If the response is length (more than 1024 characters) the generate/send a hastebin link
                try {
                    require('hastebin-gen')(response.toString(), {
                        url: 'https://drago.probably.booped.me',
                    }).then((r: string) => {
                        const embed = new MessageEmbed()
                            .setAuthor(
                                `${message.author.tag}`,
                                `${message.author.displayAvatarURL({
                                    dynamic: true,
                                })}`
                            )
                            .setTitle('Execute')
                            .setDescription(
                                `**Ran: ${script}**\n\n[\`${r}\`](${r})`
                            )
                            .setThumbnail(
                                client.user?.displayAvatarURL({
                                    dynamic: true,
                                }) ||
                                    'https://avatars.githubusercontent.com/u/40704274?s=460&u=1ef220ad5b4625d67046cb5ec9c080299dc1aa61&v=4'
                            )
                            .setTimestamp()
                            .setFooter(`User ID: ${message.author.id}`)
                            .setColor(primaryColor);
                        // Sends the embed with the hastebin link
                        message.channel.send({
                            embed,
                        });
                    });
                } catch (e) {
                    throw new Error(e);
                }
            } else {
                try {
                    const embed = new MessageEmbed()
                        .setAuthor(
                            `${message.author.tag}`,
                            `${message.author.displayAvatarURL({
                                dynamic: true,
                            })}`
                        )
                        .setTitle('Execute')
                        .setDescription(
                            `**Ran: ${script}**\n\`\`\`js\n${response.toString()} \n\`\`\``
                        )
                        .setThumbnail(
                            client.user?.displayAvatarURL({
                                dynamic: true,
                            }) ||
                                'https://avatars.githubusercontent.com/u/40704274?s=460&u=1ef220ad5b4625d67046cb5ec9c080299dc1aa61&v=4'
                        )
                        .setTimestamp()
                        .setFooter(`User ID: ${message.author.id}`)
                        .setColor(primaryColor);
                    // Sends the embed with the response embed in it... Get it?
                    await message.channel.send(embed);
                } catch (e) {
                    throw new Error(e);
                }
            }
        });
    }
};
