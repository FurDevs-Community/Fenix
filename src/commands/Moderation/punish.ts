import { Command } from 'nukejs';
import { Message } from 'discord.js';
import HozolClient from '../../lib/HozolClient';
import { IssueDiscipline, usernameResolver } from '../../helper';
import { MessageEmbed } from 'discord.js';
import { primaryColor } from '../../settings';
import { askReason, askRules } from '../../helper/moderation/askRules';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'punish',
            category: 'Moderation',
            runIn: ['text'],
            aliases: [],
            botPerms: ['MANAGE_MESSAGES'],
            userPerms: ['MANAGE_MESSAGES'],
            description: 'Use the punish menu on a user',
            enabled: true,
            extendedHelp: 'Use the punish menu on a user.',
            usage: '<Username>',
        });
    }
    async run(message: Message, args: string[], client: HozolClient) {
        if (!message.guild) return;
        if (!args[0]) throw new Error(`Provide a user of who ever you want to punish`);
        const user = await usernameResolver(message, args[0]);
        if (user.id === message.author.id) throw new Error(`You can't punish yourself!`);
        const member = message.guild.members.cache.get(user.id) || null;
        if (!member) {
            throw new Error(
                'The user is not in the Guild; They must be in the guild in order to be punished with the punish menu'
            );
        } else {
            let informationAbtUser = `**__Moderation Actions on ${user.username}__**\n\n`;
            const moderations = await member.moderation();
            const memberSettings = await member.settings();
            const profile = await member.profile();
            if (moderations.length > 0) {
                moderations.map((moderation) => {
                    informationAbtUser += `> **[${moderation.appealed ? 'APPEALED' : 'NOT APPEALED'}]**\n> Case: **${
                        moderation.cases
                    }**\n> Rules Violated: ${moderation.rules}\n> Reason: ${moderation.reason}\n\n`;
                });
            } else {
                informationAbtUser += 'This user does not have any Moderation Actions Logged into the bot\n';
            }
            if (memberSettings.vpts > 0) {
                informationAbtUser += `Violation Points: ${memberSettings.vpts}\n`;
            }
            const embed = new MessageEmbed()
                .setTitle(`Welcome to the Punish Menu!`)
                .setDescription(
                    `Target: ${user.username}\n✨ Violation Points: ${memberSettings.vpts}\n🪙 Balance: ${profile.coins}\n🆙 XP: ${profile.XP}`
                )
                .addField(`🇦 Class A`, `Warn ${user.username}`)
                .addField(`🇧 Class B`, `Give VPS, Retract XP or Fine ${user.username}`)
                .addField(
                    `🇨 Class C`,
                    `Kick or Assign Task to ${user.username} they'll be muted until this task(s) are completed`
                )
                .addField(
                    `🇩 Class D`,
                    `Mute/Restrict ${user.username} from certain channels or using the bot's functionilty like \`J>report\`, \`J>support\``
                )
                .addField(`🇪 Class E`, `Ban/TempBan ${user.username} from the guild`)
                .addField(`⏹️ Cancel`, `Close this Punish Menu`)
                .setTimestamp()
                .setColor(primaryColor)
                .setFooter(`Disciplinary System by Sector Seven | User ID: ${message.author.id}`);
            const msg = await message.channel.send(informationAbtUser, {
                embed: embed,
            });
            const allowedReactions = ['🇦', '🇧', '🇨', '🇩', '🇪', '⏹'];
            await msg.react(`🇦`);
            await msg.react(`🇧`);
            await msg.react(`🇨`);
            await msg.react(`🇩`);
            await msg.react(`🇪`);
            await msg.react(`⏹️`);
            const reactionCollector = await msg.createReactionCollector(
                (r, u) => u.id == message.author.id && allowedReactions.includes(r.emoji.name),
                {
                    time: 180000,
                }
            );
            reactionCollector.on('collect', async (r) => {
                const discipline = new IssueDiscipline(user, message.guild!, message.author);
                switch (r.emoji.name) {
                    case '🇦':
                        await msg.delete();
                        await askRules(message, discipline);
                        await askReason(message, discipline);
                        await discipline.initialize();
                        await discipline.warnUser();
                        await discipline.finish();
                        break;
                    case '⏹️':
                        await msg.delete();
                }
            });
        }
    }
};
