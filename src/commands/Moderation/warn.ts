import HozolClient from '../../lib/HozolClient';
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import { IssueDiscipline, usernameResolver } from '../../helper';
import { askReason, askRules } from '../../helper/moderation/askRules';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'warn',
            category: 'Moderation',
            runIn: ['text'],
            aliases: [],
            botPerms: ['MANAGE_MESSAGES'],
            userPerms: ['MANAGE_MESSAGES'],
            description: 'Warn a Member',
            enabled: true,
            extendedHelp: 'Warn a member.',
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
        const guildSettings = await message.guild.settings();
        if (!args[0]) {
            throw new Error(
                'Please mention, provide a User ID, or username of that user you would like to warn'
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
                `Why would you warn yourself? I, ${client.user} will not allow it like every other moderation bot (except dyno, that bot doesn't care about self-harm).`
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
                    `The bot's highest role (${message.guild?.me?.roles.highest}) must be above the user's highest role (${member.roles.highest}) in order to warn that user`
                );
            }
            if (modPosition! <= userPosition) {
                throw new Error(
                    `Your highest role (${message.member?.roles.highest}) must be higher than the user's highest role (${member.roles.highest}) in order for me to warn that user`
                );
            }
        } else {
            throw new Error("You can't warn that user; He's not in the guild");
        }

        const mod = new IssueDiscipline(user, message.guild!, message.author);
        console.log(reason);
        console.log(guildSettings.reasonSpecify);
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
        await mod.warnUser();
        await mod.setType('warning');
        await mod
            .finish()
            .then((res) => {
                const embed = new MessageEmbed()
                    .setTitle('Warn')
                    .setAuthor(
                        `Issued By: ${res.issuer.tag}`,
                        res.issuer.displayAvatarURL({ dynamic: true })
                    )
                    .addField('Violator', `${res.user.tag} (${res.user.id})`)
                    .addField('Reason:', res.reason)
                    .setTimestamp()
                    .setFooter(`User ID: ${res.issuer.id}`)
                    .setColor('YELLOW');
                message.channel.send(embed);
            })
            .catch(() => {
                message.channel.send(
                    `There was a problem, please ban ${message.author.tag}`
                );
            });
    }
}
