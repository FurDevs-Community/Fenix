import HozolClient from '../../lib/HozolClient';
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import fetch from 'node-fetch';
import { check, failed } from '../../helper/discord/sendAndAwaitMsg';
import { primaryColor } from '../../settings';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'bug',
            category: 'Support',
            runIn: ['text'],
            aliases: [],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
            cooldown: 5,
            description: 'Report a bug about Hozol',
            enabled: true,
        });
    }

    /**
     * @param {Message} message
     * @param {string[]} args
     * @param {HozolClient} client
     */
    async run(message: Message, args: string[], client: HozolClient) {
        // TODO: Cooldown, Blacklisting

        // Makes an embed
        const embed = new MessageEmbed()
            .setTitle('Submit a Bug')
            .setDescription(
                "Wanna submit a bug? Awesome! We'll go through this short and simple process"
            )
            .setFooter(
                "If you executed this command by mistake don't fret, say cancel at anytime and stop process"
            )
            .setColor(primaryColor);
        // Sends the embed and makes the message of that embed a variable
        const embedMsg = await message.channel.send(embed);
        // Sends a message asking what is the title of the issue
        const msg = await message.channel.send(
            'What should be the title of your issue'
        );
        // awaits the message
        await msg.channel
            .awaitMessages((m) => m.author == message.author, {
                max: 1,
                time: 1000 * 60,
            })
            .then(async (res) => {
                // Assign the title variable to what is said by the user
                const title: any = res.first();
                // Checks if the message conains "stop" or "cancel"
                if (!check(title)) return failed(msg, embedMsg);
                // Adds a field with the data they provided
                embed.addField('Title', title);
                // Updates the embed
                embedMsg.edit(embed);
                // Updates the msg with a new question
                await msg.edit(
                    'What is the description of your issue? Please Be elaborative and show steps on how to reproduce it.'
                );
                // awaits a message
                await msg.channel
                    .awaitMessages((m) => m.author == message.author, {
                        max: 1,
                        time: 1000 * 60 * 10,
                    })
                    .then(async (res) => {
                        // asigns a description variable with what is sent
                        const description: any = res.first();
                        // checks if the message contrains "stop" or "cancel"
                        if (!check(description)) return failed(msg, embedMsg);
                        // adds ta new field to the embed
                        embed.addField('Description', description);
                        // Updates it
                        embedMsg.edit(embed);
                        // Makes an embed
                        const confirmation = new MessageEmbed()
                            .setTitle('Submit the issue?')
                            .setColor(primaryColor);
                        // Sends a message
                        const cembed = await message.channel.send(confirmation);
                        // reacts a checkmark for confirmation
                        await cembed.react('✅');

                        // Awaits an checkmark for confirmation
                        const reaction = await cembed.awaitReactions(
                            (r, u) =>
                                r.emoji.name == '✅' &&
                                u.id == message.author.id,
                            {
                                max: 1,
                                time: 20000,
                                errors: ['time'],
                            }
                        );
                        // If the user reacts a checkmark, then create the issue
                        if (reaction.first()) {
                            const issue = {
                                title: `${title}`,
                                body: `This issue was reported by ${message.author.tag}(${message.author.id})\n\n${description}`,
                                assignees: ['DeveloperVulpo'],
                                labels: ['bug'],
                            };
                            const url =
                                'https://api.github.com/repos/Dracy-Developments/Hozol/issues';

                            await fetch(url, {
                                method: 'POST',
                                body: JSON.stringify(issue),
                                headers: {
                                    Authorization: `Token ${process.env.GHTOKEN}`,
                                    'Content-Type': 'application/json',
                                },
                            }).then((json) => {
                                if (json.status === 201) {
                                    // If it was success send the success embed
                                    const embed = new MessageEmbed()
                                        .setTitle(
                                            'Your bug report has been sent'
                                        )
                                        .setDescription(
                                            'Thanks for making Hozol better. We appreciate the support from you.'
                                        )
                                        .setColor(primaryColor);
                                    cembed.reactions.removeAll();
                                    cembed.edit(embed);
                                } else {
                                    // If not throw an error
                                    throw new Error(
                                        "An Error occured making the issue, please join the support server and message the bot developers your bug report and report that the report command doesn't work"
                                    );
                                }
                            });
                        }
                    })
                    .catch(() => {
                        msg.edit('The bug report has been cancelled');
                    });
            })
            .catch(() => {
                msg.edit('The bug report has been cancelled');
            });
    }
};
