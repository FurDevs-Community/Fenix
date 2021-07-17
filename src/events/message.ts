/* eslint-disable require-jsdoc */
import { Event } from 'nukejs';
import HozolClient from '../lib/HozolClient';
import { Message } from 'discord.js';
import { Members as Member } from '../database';
import { MessageEmbed } from 'discord.js';
// import { getSpamScore } from '../helper/moderation/getSpamScore';
import { incrementMessageCount } from '../helper/guild/incrementMessage';
import { primaryColor } from '../settings';
import { applySpamScore } from '../helper/moderation/applySpamScore';
import { getSpamScore } from '../helper/moderation/getSpamScore';
import { getXPScore } from '../helper/leveling/leveling';

module.exports = class extends Event {
    constructor() {
        super({
            name: 'message',
            enabled: true,
        });
    }

    async run(message: Message) {
        if (!message.guild) return;
        const client = <HozolClient>message.client;
        const xp = await getXPScore(client, message);
        const score = await getSpamScore(client, message);
        const memberSettings = await message.member?.settings();
        const antispamSettings = await message.guild.antispam();
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
            }
        }

        incrementMessageCount(message);
        console.log(`XP Earned for ${message.author.username}: ${xp}`);

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
