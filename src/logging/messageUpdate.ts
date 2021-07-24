/* eslint-disable require-jsdoc */
/* eslint-disable array-callback-return */
import { Event } from 'nukejs';
import { checkTextChannel, hasteful, send } from '../helper';
import { Message, MessageEmbed } from 'discord.js';
import HozolClient from '../lib/HozolClient';

const jsdiff = require('diff');

module.exports = class extends Event {
    constructor() {
        super({
            name: 'messageUpdate',
            enabled: true,
        });
    }

    async run(old: Message, message: Message) {
        const client = <HozolClient>message.client;
        const guild: any = message.guild;
        // Upgrade partial messages to full messages
        if (!checkTextChannel(message.channel)) return;
        if (message.partial) {
            await message.fetch();
        }

        // TODO
        // Reset cached calculated values; they must be re-calculated.
        // message.cachedSpamScore = null;
        // message.cachedXP = null;

        // First, update spam score if new score is bigger than old score. Do NOT update if new score is less than old score; we don't want to lower it.
        try {
            if (message.type === 'DEFAULT' && typeof message.member !== 'undefined' && message.member !== null) {
                // var oldscore = old.spamScore || message.spamScore;
                // var newscore = message.spamScore;
                // if (newscore > oldscore) {
                // var diff = newscore - oldscore;
                // await sails.helpers.spam.add(message.member, diff, message);
                // }
            }

            // TODO
            if (
                typeof message.member !== 'undefined' &&
                message.member !== null &&
                message.author.id !== client.user?.id
            ) {
                // Remove all reactions to reset reputation
                // message.reactions.removeAll();
                // var xp1 = old.XP || message.XP;
                // var xp2 = message.XP;
                // if (newscore > message.guild.settings.antispamCooldown) {
                // xp2 = 0;
                // Add rep emoji if 15 or more XP was assigned
                // } else if (
                // message.member &&
                // !message.author.bot &&
                // xp2 >= 15
                // ) {
                // message.react(message.guild.settings.repEmoji);
                // }
                // Change XP and credits
                // if (xp2 - xp1 !== 0) {
                // await sails.helpers.xp.change(message.member, xp2 - xp1);
                // }
            }
        } catch (e) {
            await client.error(e);
            // TODO: bot error log
        }

        // Skip the bot for the remainder of the script
        if (message.author.id === client.user?.id) return;

        const display = new MessageEmbed()
            .setTitle(':pencil: A message was edited')
            .setDescription(`${old.partial ? 'Unknown Message' : old.cleanContent}`)
            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
            .setColor('#6610f2')
            .setTimestamp()
            .setFooter(
                `Channel: ${message.channel.parent ? `${message.channel.parent.name} -> ` : ''}${
                    message.channel.name
                } | Channel ID: ${message.channel.id} | Message ID: ${message.id}`
            );

        let changes = false;

        // First, determine any attachment changes
        const oldAttachments: any[] = [];
        const newAttachments: any[] = [];

        if (!old.partial) {
            old.attachments.array().map((attachment) => {
                oldAttachments.push(attachment.url);
            });
        }

        message.attachments.array().map((attachment) => {
            newAttachments.push(attachment.url);
        });

        oldAttachments.map((attachment) => {
            if (newAttachments.indexOf(attachment.url) === -1) {
                display.addField('Attachment removed', JSON.stringify(attachment));
                changes = true;
            }
        });

        newAttachments.map((attachment) => {
            if (oldAttachments.indexOf(attachment.url) === -1) {
                display.addField('Attachment added', JSON.stringify(attachment));
                changes = true;
            }
        });

        // Next, determine embed changes

        const oldEmbeds: any[] = [];
        const newEmbeds: any[] = [];

        if (!old.partial) {
            old.embeds.map((embed) => {
                oldEmbeds.push(JSON.stringify(embed));
            });
        }

        message.embeds.map((embed) => {
            newEmbeds.push(JSON.stringify(embed));
        });

        oldEmbeds.map((embed) => {
            if (newEmbeds.indexOf(embed) === -1) {
                display.addField('Embed removed', embed);
                changes = true;
            }
        });

        newEmbeds.map((embed) => {
            if (oldEmbeds.indexOf(embed) === -1) {
                display.addField('Embed added', embed);
                changes = true;
            }
        });

        // Get the differences between old and new content
        const diff = jsdiff.diffSentences(old.partial ? '' : old.cleanContent, message.cleanContent);
        diff.map(async function (part: any) {
            let content;
            if (part.value.length > 1024) {
                content = await hasteful(part.value);
            } else {
                content = part.value;
            }
            if (part.added) {
                changes = true;
                display.addField('Added', content);
            } else if (part.removed) {
                changes = true;
                display.addField('Removed', content);
            }
        });

        // send a log to the channel
        if (changes) {
            await send('messageLogChannel', guild, '', {
                embed: display,
            }).catch(() => {});
        }
    }
};
