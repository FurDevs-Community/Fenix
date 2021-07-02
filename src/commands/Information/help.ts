/* eslint-disable array-callback-return */
import HozolClient from '../../lib/HozolClient';
import { Command } from 'nukejs';
import { Message, MessageEmbed, MessageReaction, User } from 'discord.js';
import { primaryColor } from '../../settings';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'help',
            category: 'Information',
            runIn: ['text'],
            aliases: ['helpme', 'h'],
            description: 'Show all the commands of Hozol!',
            enabled: true,
        });
    }

    /**
     * @param {Message} message
     * @param {string[]} args
     * @param {HozolClient} client
     */
    async run(message: Message, args: string[], client: HozolClient) {
        if (!message.guild) return;
        message.delete().catch(() => {});
        const settings = await message.guild.settings();
        const prefix = settings?.prefix || 'J>';
        const initEmbed = new MessageEmbed()
            .setTitle('Hozols Help Menu')
            .setColor(primaryColor)
            .setFooter(
                `User ID: ${message.author.id} | Make sure the bot is finished reacting before interacting`
            )
            .setDescription(
                `To seek more information to a specific command. Run \`${prefix}help [Command]\``
            )
            .addFields(
                {
                    name: 'ℹ️ Information Commands',
                    value: 'View Commands that shows information about the Bot, a Members or Guild',
                },
                {
                    name: '⚙  Management Commands',
                    value: "View Commands that configures the bot's behaviors",
                },
                {
                    name: '🔨 Moderation Commands',
                    value: 'View Commands that relates to Moderation',
                },
                {
                    name: '💁‍♂️ Bot Support Commands',
                    value: 'View Commands that relates to bot support where you can suggest or report things about Hozol',
                }
            );
        if (client.developers.includes(message.author.id)) {
            initEmbed.addField(
                '💻 Developer Commands',
                'View Commands that are reserved for Developers.'
            );
            initEmbed
                .addField('❌ Exit', 'Exit the Help menu.')
                .addField(
                    'For Bug Reports',
                    `It would be best using the \`${settings.prefix}report\` command and joining our [Support Server](https://discord.gg/R49nqt2k3g)`
                )
                .addField(
                    'For Suggestions',
                    `It would be best using the \`${settings.prefix}suggest\` command and joining our [Support Server](https://discord.gg/R49nqt2k3g)`
                )
                .addField(
                    'For Security Issues',
                    `Join our [Support Server](https://discord.gg/R49nqt2k3g) and contact \`${
                        client.users.cache.get('679145795714416661')?.tag
                    }\``
                );
        } else {
            initEmbed
                .addField('❌ Exit', 'Exit the Help menu.')
                .addField(
                    'For Bug Reports',
                    `It would be best using the \`${settings.prefix}report\` command and joining our [Support Server](https://discord.gg/R49nqt2k3g)`
                )
                .addField(
                    'For Suggestions',
                    `It would be best using the \`${settings.prefix}suggest\` command and joining our [Support Server](https://discord.gg/R49nqt2k3g)`
                )
                .addField(
                    'For Security Issues',
                    `Join our [Support Server](https://discord.gg/R49nqt2k3g) and contact \`${
                        client.users.cache.get('679145795714416661')?.tag
                    }\``
                );
        }
        const msg = await message.channel.send(initEmbed);
        await Promise.all([
            msg.react('ℹ️'),
            msg.react('⚙'),
            msg.react('🔨'),
            msg.react('💁‍♂️'),
        ]);
        if (client.developers.includes(message.author.id)) {
            msg.react('💻');
            msg.react('❌');
            const filter = (reaction: MessageReaction, user: User) => {
                return (
                    ['ℹ️', '⚙', '🔨', '💁‍♂️', '💻', '❌'].includes(
                        reaction.emoji.name
                    ) && user.id === message.author.id
                );
            };
            msg.awaitReactions(filter, {
                max: 1,
                time: 1000 * 60,
                errors: ['time'],
            })
                .then(async (collected) => {
                    const reaction = collected.first();
                    switch (reaction?.emoji.name) {
                        case 'ℹ️':
                            category(client, message, msg, 'Information');
                            break;
                        case '⚙':
                            category(client, message, msg, 'Management');
                            break;
                        case '🔨':
                            category(client, message, msg, 'Moderation');
                            break;
                        case '💁‍♂️':
                            category(client, message, msg, 'Support');
                            break;
                        case '💻':
                            category(client, message, msg, 'Developers');
                            break;
                        case '❌':
                            msg.delete().catch(() => {});
                            break;
                    }
                })
                .catch(() => {
                    if (msg.deletable) {
                        return msg.delete();
                    }
                });
        } else {
            const filter = (reaction: MessageReaction, user: User) => {
                return (
                    ['ℹ️', '⚙', '🔨', '💁‍♂️', '❌'].includes(
                        reaction.emoji.name
                    ) && user.id === message.author.id
                );
            };
            msg.awaitReactions(filter, {
                max: 1,
                time: 1000 * 60,
                errors: ['time'],
            })
                .then(async (collected) => {
                    const reaction = collected.first();
                    switch (reaction?.emoji.name) {
                        case 'ℹ️':
                            category(client, message, msg, 'Information');
                            break;
                        case '⚙':
                            category(client, message, msg, 'Management');
                            break;
                        case '🔨':
                            category(client, message, msg, 'Moderation');
                            break;
                        case '💁‍♂️':
                            category(client, message, msg, 'Support');
                            break;
                        case '❌':
                            msg.delete().catch(() => {});
                            break;
                    }
                })
                .catch(() => {
                    if (msg.deletable) {
                        return msg.delete().catch(() => {});
                    }
                });
        }

        const starting = async (
            client: HozolClient,
            message: Message,
            msg: Message
        ) => {
            await msg.reactions.removeAll().catch(() => {});
            const embed = new MessageEmbed()
                .setTitle('Hozols Help Menu')
                .setColor(primaryColor)
                .setFooter(
                    `User ID: ${message.author.id} | Make sure the bot is finished reacting before interacting`
                )
                .setDescription(
                    `To seek more information to a specific command. Run \`${prefix}help [Command]\``
                )
                .addFields(
                    {
                        name: 'ℹ️ Information Commands',
                        value: 'View Commands that shows information about the Bot, a Members or Guild',
                    },
                    {
                        name: '⚙  Management Commands',
                        value: "View Commands that configures the bot's behaviors",
                    },
                    {
                        name: '🔨 Moderation Commands',
                        value: 'View Commands that relates to Moderation',
                    },
                    {
                        name: '💁‍♂️ Bot Support Commands',
                        value: 'View Commands that relates to bot support where you can suggest or report things about Hozol',
                    }
                );

            if (client.developers.includes(message.author.id)) {
                embed.addField(
                    '💻 Developer Commands',
                    'View Commands that are reserved for Developers.'
                );
                embed.addField('❌ Exit', 'Exit the Help menu.');
            } else {
                embed.addField('❌ Exit', 'Exit the Help menu.');
            }
            msg.edit(embed);
            await Promise.all([
                msg.react('ℹ️'),
                msg.react('⚙'),
                msg.react('🔨'),
                msg.react('💁‍♂️'),
            ]);
            if (client.developers.includes(message.author.id)) {
                await msg.react('💻');
                await msg.react('❌');
                const filter = (reaction: MessageReaction, user: User) => {
                    return (
                        ['ℹ️', '⚙', '🔨', '💁‍♂️', '💻', '❌'].includes(
                            reaction.emoji.name
                        ) && user.id === message.author.id
                    );
                };
                msg.awaitReactions(filter, {
                    max: 1,
                    time: 1000 * 60,
                    errors: ['time'],
                })
                    .then(async (collected) => {
                        const reaction = collected.first();
                        switch (reaction?.emoji.name) {
                            case 'ℹ️':
                                category(client, message, msg, 'Information');
                                break;
                            case '⚙':
                                category(client, message, msg, 'Management');
                                break;
                            case '🔨':
                                category(client, message, msg, 'Moderation');
                                break;
                            case '💁‍♂️':
                                category(client, message, msg, 'Support');
                                break;
                            case '💻':
                                category(client, message, msg, 'Developers');
                                break;
                            case '❌':
                                msg.delete().catch(() => {});
                                break;
                        }
                    })
                    .catch(() => {
                        if (msg.deletable) {
                            return msg.delete().catch(() => {});
                        }
                    });
            } else {
                await msg.react('❌');
                const filter = (reaction: MessageReaction, user: User) => {
                    return (
                        ['ℹ️', '⚙', '🔨', '💁‍♂️', '❌'].includes(
                            reaction.emoji.name
                        ) && user.id === message.author.id
                    );
                };
                msg.awaitReactions(filter, {
                    max: 1,
                    time: 1000 * 60,
                    errors: ['time'],
                })
                    .then(async (collected) => {
                        const reaction = collected.first();
                        switch (reaction?.emoji.name) {
                            case 'ℹ️':
                                category(client, message, msg, 'Information');
                                break;
                            case '⚙':
                                category(client, message, msg, 'Management');
                                break;
                            case '🔨':
                                category(client, message, msg, 'Moderation');
                                break;
                            case '💁‍♂️':
                                category(client, message, msg, 'Support');
                                break;
                            case '❌':
                                msg.delete().catch(() => {});
                                break;
                        }
                    })
                    .catch(() => {
                        if (msg.deletable) {
                            return msg.delete().catch(() => {});
                        }
                    });
            }
        };

        const category = async (
            client: HozolClient,
            message: Message,
            msg: Message,
            category:
                | 'Information'
                | 'Management'
                | 'Moderation'
                | 'Developers'
                | 'Support'
        ) => {
            await msg.reactions.removeAll().catch(() => {});
            const embed = new MessageEmbed()
                .setTitle(`Hozols Help Menu - ${category}`)
                .setColor(primaryColor)
                .setFooter(
                    `User ID: ${message.author.id} | Make sure the bot is finished reacting before interacting`
                )
                .setDescription(
                    `To seek more information to a specific command. Run \`${prefix}help [Command]\``
                );
            await client.loader.Commands.map((cmd) => {
                if (cmd.category === category) {
                    embed.addField(`${prefix}${cmd.name}`, cmd.description);
                }
            });
            embed.addField('❌ Exit', 'Exit the Help menu.');
            msg.edit(embed);
            await msg.react('◀️');
            await msg.react('❌');
            const filter = (reaction: MessageReaction, user: User) => {
                return (
                    ['◀️', '❌'].includes(reaction.emoji.name) &&
                    user.id === message.author.id
                );
            };
            msg.awaitReactions(filter, {
                max: 1,
                time: 1000 * 60,
                errors: ['time'],
            })
                .then(async (collected) => {
                    const reaction = collected.first();
                    switch (reaction?.emoji.name) {
                        case '◀️':
                            starting(client, message, msg);
                            break;
                        case '❌':
                            msg.delete().catch(() => {});
                            break;
                    }
                })
                .catch(() => {
                    if (msg.deletable) {
                        return msg.delete().catch(() => {});
                    }
                });
        };
    }
}
