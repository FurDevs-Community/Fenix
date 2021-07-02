import HozolClient from '../../lib/HozolClient';
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import { IssueDiscipline, usernameResolver } from '../../helper';
import ms from 'ms';
import { askReason, askRules } from '../../helper/moderation/askRules';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'mute',
            category: 'Moderation',
            runIn: ['text'],
            aliases: [],
            botPerms: ['MANAGE_ROLES', 'SEND_MESSAGES', 'EMBED_LINKS'],
            userPerms: ['MANAGE_ROLES'],
            description: 'Mute a Member',
            enabled: true,
            extendedHelp: 'Mute a member indefintley.',
            usage: '',
        });
    }

    /**
     * @param {Message} message
     * @param {string[]} args
     * @param {HozolClient} client
     */
    async run(message: Message, args: string[], client: HozolClient) {
        if (!message.guild) return;
        await message.delete();
        const settings = await message.guild?.settings();
        if (
            !settings?.muteRole ||
            !message.guild.roles.cache.get(settings.muteRole)
        ) {
            throw new Error("Mute role doesn't exist please set one up!");
        }
        if (!args[0]) {
            throw new Error(
                'Please mention, provide a User ID, or username of that user you would like to mute'
            );
        }
        const user = await usernameResolver(message, args[0]);
        if (user === message.author) {
            throw new Error(
                `Why would you mute yourself? I, ${client.user} will not allow it like every other moderation bot.`
            );
        }
        let duration: number;
        let reason;
        if (args[1]) {
            if (ms(args[1])) {
                // duration specified
                duration = ms(args[1]);
                reason = args.splice(2).join(' ');
            } else {
                // duration not specified
                duration = 0;
                reason = args.splice(1).join(' ');
            }
        } else {
            duration = 0;
        }
        const muteRole = settings.muteRole;
        const member = message.guild.members.cache.get(user.id);
        if (member?.roles.cache.has(muteRole))
            throw new Error('The User is already muted!');
        if (member) {
            const botPosition = message.guild.me?.roles.highest.position;
            const userPosition = member.roles.highest.position;
            const modPosition = message.member?.roles.highest.position;
            if (botPosition! <= userPosition) {
                throw new Error(
                    `The bot's highest role (${message.guild?.me?.roles.highest}) must be above the user's highest role (${member.roles.highest}) in order to mute that user`
                );
            }
            if (modPosition! <= userPosition) {
                throw new Error(
                    `Your highest role (${message.member?.roles.highest}) must be higher than the user's highest role (${member.roles.highest}) in order for me to mute that user`
                );
            }
        } else {
            throw new Error(
                'The user must be in the guild in order to be muted'
            );
        }

        const guildSettings = await message.guild.settings();
        const mod = new IssueDiscipline(user, message.guild!, message.author);
        if (!reason) {
            if (guildSettings.reasonSpecify !== 'ignore') {
                await askReason(message, mod);
            }
        } else {
            await mod.setReason(reason);
        }
        if (guildSettings.rulesSpecify !== 'ignore')
            await askRules(message, mod);
        await mod.setMuteDuration(duration);
        await mod.initialize();
        await mod.muteUser();
        await mod.finish().then((discipline) => {
            const embed = new MessageEmbed()
                .setTitle('Mute')
                .setAuthor(
                    `Issued By: ${discipline.issuer.tag}`,
                    discipline.issuer.displayAvatarURL({ dynamic: true })
                )
                .addField(
                    'Violator',
                    `${discipline.user.username}(${discipline.user.id})`
                )
                .addField('Reason:', discipline.reason)
                .setTimestamp()
                .setFooter(`User ID: ${discipline.issuer.id}`)
                .setColor('BLUE');
            message.channel.send(embed);
        });
    }
};
