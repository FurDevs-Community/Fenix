/* eslint-disable require-jsdoc */
import { Event } from 'nukejs';
import HozolClient from '../lib/HozolClient';
import { Message } from 'discord.js';
import { Members as Member, Profiles } from '../database';
import { MessageEmbed } from 'discord.js';
// import { getSpamScore } from '../helper/moderation/getSpamScore';
import { incrementMessageCount } from '../helper/guild/incrementMessage';
import { primaryColor } from '../settings';
import { applySpamScore } from '../helper/moderation/applySpamScore';
import { getSpamScore } from '../helper/moderation/getSpamScore';
import { getLevelFromXP, getXPScore } from '../helper/leveling/leveling';
import ms from 'ms';
import { removeItem } from '../helper/general/removeElement';

module.exports = class extends Event {
    constructor() {
        super({
            name: 'message',
            enabled: true,
        });
    }

    async run(message: Message) {
        if (!message.guild) return;
        if (!message.client.user || (!message.guild && message.author.bot)) return;
        if (message.type !== 'DEFAULT' || message.author.id === message.client.user.id) return;
        const client = <HozolClient>message.client;
        const score = await getSpamScore(client, message);
        const memberSettings = await message.member?.settings();
        const antispamSettings = await message.guild.antispam();
        const levelingSettings = await message.guild.leveling();
        // const guildAutoModSettings = await message.guild.automoderation();
        const guildSettings = await message.guild.settings();
        if (!guildSettings) return;
        if (antispamSettings.enabled) {
            if (score && antispamSettings.enabled) await applySpamScore(message, score);
        }

        if (guildSettings.muteRole) {
            if (memberSettings?.muted && !message.member?.roles.cache.has(guildSettings.muteRole)) {
                message.member?.roles.add(
                    guildSettings.muteRole,
                    "The user is supposed to be muted (If this is a mistake go ahead and unmute the user by using the unmute command or remove the user's mute role)"
                );
                return;
            }
        }

        incrementMessageCount(message);
        if (!client.xpCooldown.includes(message.author.id)) {
            const xp = (await getXPScore(message)) || 0;
            if (xp > 0 && levelingSettings.enabled) {
                const profile = await message.member?.profile();
                const currentXP = profile?.XP || 0;
                const earningXP = profile?.XP! + xp;
                const previousLevel = getLevelFromXP(currentXP)!;
                const newLevel = getLevelFromXP(earningXP);
                console.log(currentXP);
                console.log(earningXP);
                console.log(previousLevel);
                console.log(newLevel);
                await Profiles.findOneAndUpdate(
                    { guildID: message.guild.id, userID: message.author.id },
                    { XP: earningXP }
                );
                if (newLevel > previousLevel) {
                    // TODO: Make sure this becomes customizable & give roles based on level if set
                    await message.channel?.send(`${message.author.username}, You have earned ${xp} XP points and Reached level ${newLevel}!`);
                }
                client.xpCooldown.push(message.author.id);
                setInterval(() => removeItem(client.xpCooldown, message.author.id), ms(levelingSettings.xpCooldown));
            }
        }

        if (guildSettings.awaySystem) {
            if (memberSettings?.awayStatus) {
                // afk user talked
                await Member.findOneAndUpdate(
                    { guildID: message.guild.id, userID: message.author.id },
                    { awayStatus: '' }
                );

                const embed = new MessageEmbed()
                    .setAuthor(
                        `${message.author.tag}`,
                        `${message.author.displayAvatarURL({
                            dynamic: true,
                        })}`
                    )
                    .setTitle('Welcome back!')
                    .setDescription(
                        `Welcome back ${message.author.username}#${message.author.discriminator}. I knew you wouldn't take very long`
                    )
                    .setColor(primaryColor)
                    .setFooter(`User ID: ${message.author.id}`)
                    .setTimestamp();
                (await message.channel.send(embed)).delete({ timeout: 10000 });
            }

            if (!message.mentions.members) return;
            for (const member of message.mentions.members?.values()) {
                const mentionedMember = await member.settings();
                if (mentionedMember.awayStatus) {
                    const embed = new MessageEmbed()
                        .setAuthor(
                            `${message.author.tag}`,
                            `${message.author.displayAvatarURL({
                                dynamic: true,
                            })}`
                        )
                        .setTitle(`${member.user.username}#${member.user.discriminator} is currently away.`)
                        .setDescription(mentionedMember.awayStatus)
                        .setColor(primaryColor)
                        .setFooter(`User ID: ${message.author.id}`)
                        .setTimestamp();
                    (await message.channel.send(embed)).delete({
                        timeout: 10000,
                    });
                }
            }
        }

        const mentionRegex = RegExp(`^<@!${client.user?.id}>$`);
        if (message.content.match(mentionRegex)) {
            return message.channel.send(
                `Heya ${message.author}! My Prefix set for this guild is \`${(await message.guild.settings()).prefix}\``
            );
        }
    }
};
