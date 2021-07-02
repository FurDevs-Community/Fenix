import HozolClient from '../../lib/HozolClient';
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import { askReason, askRules } from '../../helper/moderation/askRules';
import { IssueDiscipline, usernameResolver } from '../../helper';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'kick',
            category: 'Moderation',
            runIn: ['text'],
            aliases: [],
            botPerms: ['KICK_MEMBERS'],
            userPerms: ['KICK_MEMBERS'],
            description: 'Kick a Member',
            enabled: true,
            extendedHelp: 'Kick a member.',
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
        if (!args[0]) {
            throw new Error(
                'Please mention, provide a User ID, or username of that user you would like to kick'
            );
        }
        const user = await usernameResolver(message, args[0]);
        if (
            message.author.id === '679145795714416661' &&
            user.id === '679145795714416661'
        ) {
            return message.channel.send(
                'Mhm, Okay Vulpo\n\nhttps://cdn.discordapp.com/attachments/614909956881121308/809620338027266048/kotc.jpg'
            );
        }
        if (user === message.author) {
            throw new Error(
                `Why would you kick yourself? I, ${client.user} will not allow it like every other moderation bot.`
            );
        }
        const reason = args.slice(1).join(' ');
        const member = message.guild?.members.cache.get(user.id);
        if (member) {
            const botPosition = message.guild?.me?.roles.highest.position;
            const userPosition = member.roles.highest.position;
            const modPosition = message.member?.roles.highest.position;
            if (botPosition! <= userPosition) {
                throw new Error(
                    `The bot's highest role (${message.guild?.me?.roles.highest}) must be above the user's highest role (${member.roles.highest}) in order to kick that user`
                );
            }
            if (modPosition! <= userPosition) {
                throw new Error(
                    `Your highest role (${message.member?.roles.highest}) must be higher than the user's highest role (${member.roles.highest}) in order for me to kick that user`
                );
            }
        } else {
            throw new Error("You can't kick that user; He's not in the guild");
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
        await mod.initialize();
        await mod.kickUser();
        await mod.finish().then((discipline) => {
            const embed = new MessageEmbed()
                .setTitle('Kick')
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
                .setColor('RED');
            message.channel.send(embed);
        });
    }
}
