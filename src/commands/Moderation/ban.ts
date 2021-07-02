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
            name: 'ban',
            category: 'Moderation',
            runIn: ['text'],
            aliases: ['cancel'],
            botPerms: ['BAN_MEMBERS'],
            userPerms: ['BAN_MEMBERS'],
            description: 'Ban a Member',
            enabled: true,
            extendedHelp: 'Ban a member indefinitely.',
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
        if (!message.guild) return;
        if (!args[0]) {
            throw new Error(
                'Please mention, provide a User ID, or username of that user you would like to ban'
            );
        }
        const user = await usernameResolver(message, args[0]);
        if (
            user.id === '679145795714416661' &&
            message.author.id === '679145795714416661'
        ) {
            return message.channel.send(
                'mhm, okay vulpo \n\nhttps://cdn.discordapp.com/attachments/614909956881121308/809763155386302524/ban1.jpg '
            );
        }
        if (user === message.author) {
            throw new Error(
                `Why would you ban yourself? I, ${client.user} will not allow it like every other moderation bot.`
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
        const banned = await message.guild?.fetchBan(user).catch(() => {});
        if (banned) throw new Error('The User is already banned!');
        const member = message.guild?.members.cache.get(user.id);
        if (member) {
            const botPosition = message.guild?.me?.roles.highest.position;
            const userPosition = member.roles.highest.position;
            const modPosition = message.member?.roles.highest.position;
            if (botPosition! <= userPosition) {
                throw new Error(
                    `The bot's highest role (${message.guild?.me?.roles.highest}) must be above the user's highest role (${member.roles.highest}) in order to ban that user`
                );
            }
            if (modPosition! <= userPosition) {
                throw new Error(
                    `Your highest role (${message.member?.roles.highest}) must be higher than the user's highest role (${member.roles.highest}) in order for me to ban that user`
                );
            }
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
        await mod.setBanDuration(duration);
        await mod.initialize();
        await mod.banUser();
        await mod.finish().then(async (discipline) => {
            const embed = new MessageEmbed()
                .setTitle('Ban')
                .setAuthor(
                    `Issued By: ${discipline.issuer.tag}`,
                    discipline.issuer.displayAvatarURL({ dynamic: true })
                )
                .addField(
                    'Violator',
                    `${discipline.user} (${discipline.user.id})`
                )
                .addField('Reason:', discipline.reason)
                .setTimestamp()
                .setFooter(`User ID: ${discipline.issuer.id}`)
                .setColor('RED');
            await message.channel.send(embed);
        });
    }
}
