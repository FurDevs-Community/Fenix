import HozolClient from '../../lib/HozolClient';
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import { AntiSpams, updateBoolean, updateChannel, updateRole, updateSpecify } from '../../database';
import { roleNameResolver } from '../../helper';
import { primaryColor } from '../../settings';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'settings',
            category: 'Management',
            runIn: ['text'],
            aliases: ['setting'],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
            userPerms: ['MANAGE_GUILD'],
            cooldown: 0,
            description: 'View/Modify the guilds settings',
            enabled: true,
            usage: '<Logging|Guild>',
        });
    }

    /**
     * @param {Message} message
     * @param {string[]} args
     * @param {HozolClient} client
     */
    async run(message: Message, args: string[], client: HozolClient) {
        if (!message.guild) return;
        // Delete the original command message
        await message.delete();
        if (args[0]) {
            switch (args[0]) {
                case 'logging':
                    if (!args[1]) {
                        const GuildSettings = await message.guild.settings();
                        const info = new MessageEmbed()
                            .setAuthor(
                                `${message.author.tag}`,
                                `${message.author.displayAvatarURL({
                                    dynamic: true,
                                })}`
                            )
                            .setColor(primaryColor)
                            .setTitle('Logging Settings')
                            .addField('Guild ID:', `${GuildSettings.guildID}`, true)
                            .addField('Prefix:', `${GuildSettings.prefix}`, true)
                            .addField(
                                'incidentsCategory',
                                `${
                                    GuildSettings.incidentsCategory
                                        ? message.guild.channels.resolve(GuildSettings.incidentsCategory)?.name
                                        : 'Not set!'
                                }`,
                                true
                            )
                            .addField(
                                'banLogChannel',
                                `${
                                    GuildSettings.banLogChannel
                                        ? message.guild.channels.resolve(GuildSettings.banLogChannel)
                                        : 'Not set!'
                                }`,
                                true
                            )
                            .addField(
                                'kickLogChannel',
                                `${
                                    GuildSettings.kickLogChannel
                                        ? message.guild?.channels.resolve(GuildSettings.kickLogChannel)
                                        : 'Not set!'
                                }`,
                                true
                            )
                            .addField(
                                'modLogChannel',
                                `${
                                    GuildSettings.modLogChannel
                                        ? message.guild?.channels.resolve(GuildSettings.modLogChannel)
                                        : 'Not set!'
                                }`,
                                true
                            )
                            .addField(
                                'publicModLogChannel',
                                `${
                                    GuildSettings.publicModLogChannel
                                        ? message.guild?.channels.resolve(GuildSettings.publicModLogChannel)
                                        : 'Not set!'
                                }`,
                                true
                            )
                            .addField(
                                'joinLogChannel',
                                `${
                                    GuildSettings.joinLogChannel
                                        ? message.guild?.channels.resolve(GuildSettings.joinLogChannel)
                                        : 'Not set!'
                                }`,
                                true
                            )
                            .addField(
                                'leaveLogChannel',
                                `${
                                    GuildSettings.leaveLogChannel
                                        ? message.guild?.channels.resolve(GuildSettings.leaveLogChannel)
                                        : 'Not set!'
                                }`,
                                true
                            )
                            .addField(
                                'autoModLogChannel',
                                `${
                                    GuildSettings.autoModLogChannel
                                        ? message.guild?.channels.resolve(GuildSettings.autoModLogChannel)
                                        : 'Not set!'
                                }`,
                                true
                            )
                            .addField(
                                'channelLogChannel',
                                `${
                                    GuildSettings.channelLogChannel
                                        ? message.guild?.channels.resolve(GuildSettings.channelLogChannel)
                                        : 'Not set!'
                                }`,
                                true
                            )
                            .addField(
                                'messageLogChannel',
                                `${
                                    GuildSettings.messageLogChannel
                                        ? message.guild?.channels.resolve(GuildSettings.messageLogChannel)
                                        : 'Not set!'
                                }`,
                                true
                            )
                            .addField(
                                'userLogChannel',
                                `${
                                    GuildSettings.userLogChannel
                                        ? message.guild?.channels.resolve(GuildSettings.userLogChannel)
                                        : 'Not set!'
                                }`,
                                true
                            )
                            .addField(
                                'generalChannel',
                                `${
                                    GuildSettings.generalChannel
                                        ? message.guild?.channels.resolve(GuildSettings.generalChannel)
                                        : 'Not set!'
                                }`,
                                true
                            )
                            .addField(
                                'announcementsChannel',
                                `${
                                    GuildSettings.announcementsChannel
                                        ? message.guild?.channels.resolve(GuildSettings.announcementsChannel)
                                        : 'Not set!'
                                }`,
                                true
                            )
                            .addField(
                                'Flag Channel',
                                `${
                                    GuildSettings.flagChannel
                                        ? message.guild?.channels.resolve(GuildSettings.flagChannel)
                                        : 'Not set!'
                                }`,
                                true
                            )
                            .addField(
                                'Stats Channel',
                                `${
                                    GuildSettings.statsChannel
                                        ? message.guild?.channels.resolve(GuildSettings.statsChannel)
                                        : 'Not set!'
                                }`
                            )

                            .setFooter(
                                `User ID: ${message.author.id}`,
                                `${message.author.displayAvatarURL({
                                    dynamic: true,
                                })}`
                            );
                        return message.channel.send(info);
                    } else {
                        const type = args[1] as
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
                            | 'announcementsChannel'
                            | 'flagChannel'
                            | 'statsChannel';
                        const channelTypes = [
                            'banLogChannel',
                            'kickLogChannel',
                            'modLogChannel',
                            'publicModLogChannel',
                            'joinLogChannel',
                            'leaveLogChannel',
                            'autoModLogChannel',
                            'channelLogChannel',
                            'messageLogChannel',
                            'userLogChannel',
                            'generalChannel',
                            'announcementsChannel',
                            'flagChannel',
                            'statsChannel',
                        ];
                        if (!channelTypes.includes(type)) {
                            throw new Error(
                                `Please choose the correct channel type. Channel Types:\n\n\`\`\`\n${channelTypes.join(
                                    '\n'
                                )}\n\`\`\``
                            );
                        }
                        const channel = message.mentions.channels.first() || message.guild?.channels.cache.get(args[2]);
                        if (!channel && args[2]) {
                            throw new Error('The 3rd parameter you provided is not a valid channel nor channel id.');
                        }
                        if (channel && type) {
                            updateChannel(channel.guild.id, channel.id, type);
                            let change;
                            if (channel?.type === 'category' || channel.type === 'voice') {
                                change = channel.name;
                            } else {
                                change = channel;
                            }
                            message.reply(`Alrighty! ${type} is now set to send messages to ${change}`);
                        } else {
                            const settings = await message.guild.settings();
                            if (settings) {
                                const chan = message.guild?.channels.resolve(settings[type]);
                                message.reply(`The current channel for type \`${type}\` is ${chan || 'Not Set'}!`);
                            } else {
                                throw new Error(
                                    'How do you get this error... This is there just to make typescript stop whining...'
                                );
                            }
                        }
                    }
                    break;
                case 'guild':
                    if (!args[1]) {
                        const GuildSettings = await message.guild.settings();
                        const embed = new MessageEmbed()
                            .setAuthor(
                                `${message.author.tag}`,
                                `${message.author.displayAvatarURL({
                                    dynamic: true,
                                })}`
                            )
                            .setURL('https://www.google.com')
                            .setColor(primaryColor)
                            .setTitle('Guild Settings')
                            .addField('Guild ID:', `${GuildSettings.guildID}`, true)
                            .addField('Prefix:', `${GuildSettings.prefix}`, true)
                            .addField('Mute Role:', `${GuildSettings.muteRole}`, true)
                            .addField('Manager Role:', `${GuildSettings.botManagerRole}`, true)
                            .addField('Mod Role:', `${GuildSettings.botModRole}`, true)
                            .addField('Bot Verified Role:', `${GuildSettings.verifiedRole}`, true)
                            .addField('Reputation System:', `${GuildSettings.reputationSystem}`, true)
                            .addField('Away System:', `${GuildSettings.awaySystem}`, true)
                            .addField('Welcome Incidents Message:', `\`\`\`${GuildSettings.welcomeIncidentText}\`\`\``)
                            .addField('Welcome Incidents Message:', `\`\`\`${GuildSettings.announcementsChannel}\`\`\``)
                            .setFooter(
                                `User ID: ${message.author.id}`,
                                `${message.author.displayAvatarURL({
                                    dynamic: true,
                                })}`
                            );
                        return message.channel.send(embed);
                    } else {
                        const type = args[1] as
                            | 'welcomeCategory'
                            | 'muteRole'
                            | 'botManagerRole'
                            | 'botModRole'
                            | 'verifiedRole'
                            | 'incidentsCategory'
                            | 'reputationSystem'
                            | 'reputationEmoji'
                            | 'selfModeration'
                            | 'selfModerationMintes'
                            | 'vptDecayXP'
                            | 'vptDecayHours'
                            | 'welcomeIncidentText'
                            | 'appealFormLink'
                            | 'compactLogging'
                            | 'rulesSpecify'
                            | 'reasonSpecify'
                            | 'awaySystem'
                            | 'statsMessage'
                            | 'welcomeMessage'
                            | 'sendWelcomeMessage'
                            | 'verificationMethod';
                        const settings = [
                            'welcomeCategory',
                            'muteRole',
                            'botManagerRole',
                            'botModRole',
                            'verifiedRole',
                            'incidentsCategory',
                            'reputationSystem',
                            'reputationEmoji',
                            'selfModeration',
                            'selfModerationMintes',
                            'vptDecayXP',
                            'vptDecayHours',
                            'welcomeIncidentText',
                            'appealFormLink',
                            'compactLogging',
                            'rulesSpecify',
                            'reasonSpecify',
                            'awaySystem',
                            'statsMessage',
                            'welcomeMessage',
                            'sendWelcomeMessage',
                            'verificationMethod',
                        ];

                        if (!settings.includes(type)) {
                            throw new Error(
                                `Please specify the correct settings you're wThng to modify\n\n\`\`\`${settings.join(
                                    '\n'
                                )}\n\`\`\``
                            );
                        }

                        if (type === 'welcomeCategory' || type === 'incidentsCategory') {
                            const channel =
                                message.mentions.channels.first() || message.guild?.channels.cache.get(args[2]);
                            if (!channel && args[2]) {
                                throw new Error(
                                    'The 3rd parameter you provided is not a valid channel nor channel id.'
                                );
                            }
                            if (channel && type) {
                                updateChannel(channel.guild.id, channel.id, type);
                                let change;
                                if (channel?.type === 'category' || channel.type === 'voice') {
                                    change = channel.name;
                                } else {
                                    change = channel;
                                }
                                message.reply(`Alrighty! ${type} is now set to send messages to ${change}`);
                            } else {
                                const settings = await message.guild?.settings;
                                if (settings) {
                                    const chan = message.guild?.channels.resolve(
                                        // @ts-ignore
                                        settings[type]
                                    );
                                    message.reply(`The current channel for type \`${type}\` is ${chan || 'Not Set'}!`);
                                } else {
                                    throw new Error(
                                        'How do you get this error... This is there just to make typescript stop whining...'
                                    );
                                }
                            }
                        } else if (
                            type === 'botManagerRole' ||
                            type === 'botModRole' ||
                            type === 'muteRole' ||
                            type === 'verifiedRole'
                        ) {
                            if (!args[2]) {
                                const settings = await message.guild.settings();
                                if (settings) {
                                    const role = message.guild?.roles.resolve(settings[type]);
                                    const embed = new MessageEmbed()
                                        .setColor('BLUE')
                                        .setDescription(
                                            `The current channel for type \`${type}\` is ${role || 'Not Set'}!`
                                        );
                                    message.channel.send(embed);
                                } else {
                                    throw new Error(
                                        'How do you get this error... This is there just to make typescript stop whining...'
                                    );
                                }
                            } else {
                                const role = await roleNameResolver(message, args[2]);
                                if (args[2] && role) {
                                    await updateRole(message.guild?.id, role, type);
                                    const embed = new MessageEmbed().setDescription(
                                        `Alrighty, ${type} is now set to ${role.name}`
                                    );
                                    message.reply(embed);
                                }
                            }
                        } else if (
                            type === 'reputationSystem' ||
                            type === 'compactLogging' ||
                            type === 'awaySystem' ||
                            type === 'sendWelcomeMessage'
                        ) {
                            if (!args[1]) {
                                const settings = await message.guild.settings();
                                if (settings) {
                                    message.reply(`The current channel for type \`${type}\` is ${settings[type]}!`);
                                } else {
                                    throw new Error(
                                        'How do you get this error... This is there just to make typescript stop whining...'
                                    );
                                }
                            } else {
                                const correctValues = ['true', 'false'];
                                if (!correctValues.includes(args[2]))
                                    throw new Error(
                                        'Please provide whether or not it should be true (to enable) or false (to disable)'
                                    );
                                else {
                                    await updateBoolean(message.guild?.id, args[2], type);
                                    message.reply(`Alrighty! ${type} is now set to send messages to ${args[2]}`);
                                }
                            }
                        } else if (type === 'rulesSpecify' || type === 'reasonSpecify') {
                            if (!args[1]) {
                                const settings = await message.guild.settings();
                                if (settings) {
                                    message.reply(`The current channel for type \`${type}\` is ${settings[type]}!`);
                                } else {
                                    throw new Error(
                                        'How do you get this error... This is there just to make typescript stop whining...'
                                    );
                                }
                            } else {
                                const correctValues = ['required', 'optional', 'ignore'];
                                if (!correctValues.includes(args[2]))
                                    throw new Error('Please provide either "required", "optional" "ignore"');
                                else {
                                    await updateSpecify(message.guild?.id, args[2], type);
                                    message.reply(`Alrighty! ${type} is now set to ${args[2]}`);
                                }
                            }
                        } else if (type === 'statsMessage') {
                            await updateSpecify(message.guild.id, args[2], 'statsMessage');
                            message.reply(`Alrighty! ${type} is now set to ${args[2]}`);
                        } else if (type === 'verificationMethod') {
                            if (!args[1]) {
                                const settings = await message.guild.settings();
                                if (settings) {
                                    message.reply(`The current channel for type \`${type}\` is ${settings[type]}!`);
                                } else {
                                    throw new Error(
                                        'How do you get this error... This is there just to make typescript stop whining...'
                                    );
                                }
                            } else {
                                const correctValues = ['manual', 'email', 'puzzle', 'captcha', 'incidents'];
                                if (!correctValues.includes(args[2]))
                                    throw new Error('Please provide either "manual", "email" "puzzle" or "captch"');
                                else {
                                    await updateSpecify(message.guild?.id, args[2], type);
                                    message.reply(`Alrighty! ${type} is now set to ${args[2]}`);
                                }
                            }
                        } else if (
                            type == 'appealFormLink' ||
                            type == 'reputationEmoji' ||
                            type == 'welcomeIncidentText' ||
                            type == 'welcomeMessage'
                        ) {
                            if (!args[1]) {
                                const settings = await message.guild.settings();
                                if (settings) {
                                    message.reply(`The current channel for type \`${type}\` is ${settings[type]}!`);
                                } else {
                                    throw new Error(
                                        'How do you get this error... This is there just to make typescript stop whining...'
                                    );
                                }
                            } else {
                                await updateSpecify(message.guild?.id, args.slice(2).join(' '), type);
                                message.reply(`Alrighty! ${type} is now set to ${args.slice(2).join(' ')}`);
                            }
                        }
                    }
                    break;
                case 'antispam':
                    if (!args[1]) {
                        const AntiSpamSettings = await message.guild.antispam();
                        const embed = new MessageEmbed()
                            .setAuthor(
                                `${message.author.tag}`,
                                `${message.author.displayAvatarURL({
                                    dynamic: true,
                                })}`
                            )
                            .setURL('https://www.google.com')
                            .setColor(primaryColor)
                            .setTitle('Antispam Settings')
                            .addField('Guild ID:', `${AntiSpamSettings.guildID}`, true)
                            .addField('Enabled:', `${AntiSpamSettings.enabled}`, true)
                            .addField('Flag Threshold:', `${AntiSpamSettings.flagThreshold}`, true)
                            .addField('Threshold:', `${AntiSpamSettings.threshold}`, true)
                            .addField('Decay Fast:', `${AntiSpamSettings.decayFast}`, true)
                            .addField('Decay Slow:', `${AntiSpamSettings.decaySlow}`, true)
                            .addField('Muted Multiplier:', `${AntiSpamSettings.mutedMultiplier}`, true)
                            .addField('Base Multiplier:', `${AntiSpamSettings.baseMultiplier}`, true)
                            .addField(
                                'Less Strict Role Multiplier:',
                                `${AntiSpamSettings.lessStrictRoleMultiplier}`,
                                true
                            )
                            .addField(
                                'Less Strict Channel Multiplier:',
                                `${AntiSpamSettings.lessStrictChannelMultiplier}`,
                                true
                            )
                            .addField('Base Score:', `${AntiSpamSettings.baseScore}`, true)
                            .addField('Mention Score:', `${AntiSpamSettings.mentionScore}`, true)
                            .addField('Everyone Here Score:', `${AntiSpamSettings.everyoneHereScore}`, true)
                            .addField('Embeds Score:', `${AntiSpamSettings.embedsScore}`, true)
                            .addField('Attachment Score:', `${AntiSpamSettings.attachmentScore}`, true)
                            .addField('Characters Per Second:', `${AntiSpamSettings.charactersPerSecond}`, true)
                            .addField('Message History Minutes:', `${AntiSpamSettings.charactersPerSecond}`, true)
                            .addField('Similarity Percent:', `${AntiSpamSettings.similarityPercent}`, true)
                            .addField('Similarity Score:', `${AntiSpamSettings.similarityScore}`, true)
                            .addField('Shout Percent:', `${AntiSpamSettings.shoutPercent}`, true)
                            .addField('Shout Score:', `${AntiSpamSettings.shoutScore}`, true)
                            .addField('Repeat Characters:', `${AntiSpamSettings.repeatCharacters}`, true)
                            .addField('Repeat Character Score:', `${AntiSpamSettings.repeatCharactersScore}`, true)
                            .addField(
                                'New Lines Allowed Per Characters:',
                                `${AntiSpamSettings.newLinesAllowedPerCharacters}`,
                                true
                            )
                            .addField('New Lines Score:', `${AntiSpamSettings.newLinesScore}`, true)
                            .addField('Originality Percent:', `${AntiSpamSettings.originalityPercent}`, true)
                            .addField('Profanity Score:', `${AntiSpamSettings.profanityScore}`, true)
                            .setFooter(
                                `User ID: ${message.author.id}`,
                                `${message.author.displayAvatarURL({
                                    dynamic: true,
                                })}`
                            );
                        return message.channel.send(embed);
                    } else {
                        const type = args[1];
                        const settings = [
                            'enabled',
                            'flagThreshold',
                            'threshold',
                            'decayFast',
                            'decaySlow',
                            'mutedMultiplier',
                            'baseMultiplier',
                            'lessStrictRoleMultiplier',
                            'lessStrictChannelMultiplier',
                            'baseScore',
                            'mentionScore',
                            'everyoneHereScore',
                            'embedsScore',
                            'attachmentScore',
                            'charactersPerSecond',
                            'messageHistoryMinutes',
                            'similarityPercent',
                            'similarityScore',
                            'shoutPercent',
                            'repeatCharacters',
                            'repeatCharactersScore',
                            'newLinesAllowedPerCharacters',
                            'newLinesScore',
                            'originalityPercent',
                            'profanityScore',
                        ];

                        if (!settings.includes(type)) {
                            throw new Error(
                                `Please specify the correct settings you're wThng to modify\n\n\`\`\`${settings.join(
                                    '\n'
                                )}\n\`\`\``
                            );
                        }

                        if (type === 'enabled') {
                            if (['on', 'yes', 'true'].includes(args[2])) {
                                AntiSpams.updateOne({ guildID: message.guild.id }, { enabled: true });
                                message.reply('Antispam has been activated!');
                            } else if (['off', 'no', 'false'].includes(args[2])) {
                                AntiSpams.updateOne({ guildID: message.guild.id }, { enabled: false });
                                message.reply('Antispam has been deactivated!');
                            } else {
                                throw new Error('Please use either "on" or "off"');
                            }
                        } else if (
                            [
                                'flagThreshold',
                                'threshold',
                                'decayFast',
                                'decaySlow',
                                'mutedMultiplier',
                                'baseMultiplier',
                                'lessStrictRoleMultiplier',
                                'lessStrictChannelMultiplier',
                                'baseScore',
                                'mentionScore',
                                'everyoneHereScore',
                                'embedsScore',
                                'attachmentScore',
                                'charactersPerSecond',
                                'messageHistoryMinutes',
                                'similarityPercent',
                                'similarityScore',
                                'shoutPercent',
                                'repeatCharacters',
                                'repeatCharactersScore',
                                'newLinesAllowedPerCharacters',
                                'newLinesScore',
                                'originalityPercent',
                                'profanityScore',
                            ].includes(type)
                        ) {
                            if (isNaN(Number(args[2]))) throw new Error('Your Settings value must be numeric');

                            AntiSpams.updateOne({ guildID: message.guild.id }, { [args[1]]: Number(args[2]) });
                            message.reply(`Value for **${type}** changed to **${args[2]}**!`);
                        } else {
                            throw new Error('Setting not found!\nChoose from:\n\n' + settings.join(', '));
                        }
                    }
                    break;
                default:
                    throw new Error(
                        `Missing parameters what settings would you like to view/modify\n\n\`${await (
                            await message.guild.settings()
                        ).prefix}settings logging [channelType] [channel]\`\n\`${await (
                            await message.guild.settings()
                        ).prefix}settings guild [guildSettingType] [Value]\``
                    );
            }
        } else {
            throw new Error(
                `Missing parameters what settings would you like to view/modify\n\n\`${await (
                    await message.guild.settings()
                ).prefix}settings logging [channelType] [channel]\`\n\`${await (
                    await message.guild.settings()
                ).prefix}settings guild [guildSettingType] [Value]\``
            );
        }
    }
};
