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
            name: 'suggestion',
            category: 'Support',
            runIn: ['text'],
            aliases: ['suggest'],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
            cooldown: 60,
            description: 'Make a suggestion for Hozol',
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
            .setTitle('Submit a Suggestion')
            .setDescription(
                "Wanna submit a suggestion? Awesome! We'll go through this short and simple process"
            )
            .setFooter(
                "If you executed this command by mistake don't fret, say cancel at anytime and stop process"
            )
            .setColor(primaryColor);
        // Sends the embed, assigning it as a variable
        const embedMsg = await message.channel.send(embed);
        // send a message and assign it to the variable
        const msg = await message.channel.send(
            'What should be the title of your suggestion'
        );
        // await a message
        await msg.channel
            .awaitMessages((m) => m.author == message.author, {
                max: 1,
                time: 1000 * 60,
                errors: ['time'],
            })
            .then(async (am) => {
                // assign what was received to a variable
                const title: any = am.first();
                // checks if the title is "cancel" or "stop"
                if (!check(title)) return failed(msg, embedMsg);
                // Adds what was received to the title to the embed
                embed.addField('Title', title);
                // Edits the embed message with the new data
                embedMsg.edit(embed);
                // Edits the messsage asking a new question
                await msg.edit(
                    'What is the description of your suggestion? Please Be elaborative.'
                );
                // awaits another message
                await msg.channel
                    .awaitMessages((m) => m.author == message.author, {
                        max: 1,
                        time: 1000 * 60 * 10,
                        errors: ['time'],
                    })
                    .then(async (bm) => {
                        // assign what was received to the description variable
                        const description: any = bm.first();
                        // checks if the description variable is "cancel" or "stop" to stop the process
                        if (!check(description)) return failed(msg, embedMsg);
                        // adds what was received in the embed
                        embed.addField('Description', description);
                        // Update the embed
                        embedMsg.edit(embed);
                        // Make a confirmation embed
                        const confirmation = new MessageEmbed()
                            .setTitle('Submit the issue?')
                            .setColor(primaryColor);
                        // send the confirmation embed assigning it to a variable
                        const cembed = await message.channel.send(confirmation);
                        // react a checkmark for confirmation
                        await cembed.react('✅');

                        // Awaits a reaction for confirmation
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
                        // Once it receives the confirmation
                        if (reaction.first()) {
                            const issue = {
                                title: `${title}`,
                                body: `This issue was reported by ${message.author.username}(${message.author.username})\n\n${description}`,
                                assignees: ['DeveloperVulpo'],
                                labels: ['enhancement'],
                            };
                            const url =
                                'https://api.github.com/repos/Dracy-Developments/Hozol/issues';
                            // Create an issue on my account to the repo
                            await fetch(url, {
                                method: 'POST',
                                body: JSON.stringify(issue),
                                headers: {
                                    Authorization: `Token ${process.env.GHTOKEN}`,
                                    'Content-Type': 'application/json',
                                },
                            }).then((json) => {
                                if (json.status === 201) {
                                    // If it was successful than make an embed then send it
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
                                    // If not, just throw an error saying there was problems and instructing the user to report the bug the bug to developers as well as the suggestion command not working
                                    throw new Error(
                                        "An Error occured making the issue, please join the support server and message the bot developers your bug report and report that the report command doesn't work"
                                    );
                                }
                            });
                        }
                    })
                    .catch(() => {
                        msg.edit('Prompt Cancelled');
                    });
            })
            .catch(() => {
                msg.edit('Prompt cancelled.');
            });
    }
}
