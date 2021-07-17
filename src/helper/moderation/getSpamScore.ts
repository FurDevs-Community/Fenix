import { Message, TextChannel } from 'discord.js';
import moment from 'moment';
import HozolClient from '../../lib/HozolClient';
import { compareTwoStrings } from 'string-similarity';
import { MessageEmbed } from 'discord.js';

export const getSpamScore = async (client: HozolClient, message: Message) => {
    if (!client.user || !message.guild) return;
    if (message.type !== 'DEFAULT' || message.author.id === client.user.id) return;

    // Settings
    const autoModerationSettings = await message.guild.automoderation();
    const antiSpamSettings = await message.guild.antispam();
    const settings = await message.guild.settings();

    // Variables
    const arrayOfBadWords = [...autoModerationSettings.bannedWords];
    const messageTime = message.cleanContent.length / antiSpamSettings.charactersPerSecond;
    const amountOfMentions = message.mentions.members?.size || 0;
    const messagesFromAuthor = message.channel.messages.cache.filter((msg) => {
        if (message.partial || message === null || !message) return false;
        return (
            msg.id !== message.id &&
            msg.author.id === message.author.id &&
            moment(message.createdAt)
                .subtract(antiSpamSettings.messageHistoryMinutes, 'minutes')
                .isBefore(moment(msg.createdAt)) &&
            moment(message.createdAt).isAfter(moment(msg.createdAt))
        );
    });
    const amountOfEmbeds = message.embeds.length || 0;
    const amountOfAttachments = message.attachments.size || 0;
    const badWordsCount = (() => {
        let counter = 0;
        const msgSplit = message.cleanContent.split(/\W/g);
        msgSplit.forEach((word) => {
            if (arrayOfBadWords.includes(word)) counter++;
        });
        return counter;
    })();
    let score = antiSpamSettings.baseScore;
    let tempScore = 0;
    const reasons: {
        [index: string]: number;
    } = {};

    // Bad Word
    if (badWordsCount > 0) {
        tempScore = antiSpamSettings.profanityScore * badWordsCount;
        score += tempScore;
        reasons['Profanity'] = tempScore;
    }

    // Mention
    if (amountOfMentions > 0) {
        tempScore = antiSpamSettings.mentionScore * amountOfMentions;
        score += tempScore;
        reasons['Mentions'] = tempScore;
    }

    // Embed/Link
    if (amountOfEmbeds > 0) {
        tempScore = antiSpamSettings.embedsScore * amountOfEmbeds;
        score += tempScore;
        reasons['Link/Embed'] = tempScore;
    }

    // Attachments
    if (amountOfAttachments > 0) {
        tempScore = antiSpamSettings.attachmentScore * amountOfAttachments;
        score += tempScore;
        reasons['Attachment'] = tempScore;
    }

    // @everyone & @here
    if (message.mentions.everyone) {
        tempScore = antiSpamSettings.everyoneHereScore;
        score += tempScore;
        reasons['Everyone/Here Mention'] = tempScore;
    }

    // Repeated Characters
    // TODO: Make this flexable
    const MultpleCharactersRegex = new RegExp(/(.)\1{5,}/);
    if (MultpleCharactersRegex.test(message.cleanContent.toLowerCase())) {
        tempScore = antiSpamSettings.repeatCharactersScore;
        score += tempScore;
        reasons['Repeating Characters'] = tempScore;
    }

    // Flood Chat/Spam & Copy/Paste
    messagesFromAuthor.each((msg) => {
        const timediff = moment(message.createdAt).diff(moment(msg.createdAt), 'seconds');
        if (timediff <= messageTime && !message.author.bot) {
            tempScore = Math.floor(messageTime - timediff + 1);
            score += tempScore;
            reasons['Flooding / Rapid Typing'] = tempScore;
        }
        const similarity = compareTwoStrings(
            `${message.cleanContent || ''}${JSON.stringify(message.embeds)}${JSON.stringify(
                message.attachments.array()
            )}`,
            `${msg.cleanContent || ''}${JSON.stringify(msg.embeds)}${JSON.stringify(msg.attachments.array())}`
        );
        console.log(similarity);
        console.log(antiSpamSettings.similarityPercent);
        if (similarity >= antiSpamSettings.similarityPercent * 0.01) {
            tempScore = Math.floor(
                (10 - (1 - similarity) * antiSpamSettings.similarityScore) *
                    (1 + 0.1 * (message.cleanContent ? message.cleanContent.length / 100 : 0))
            );
            score += tempScore;
            reasons['Copy-Pasting'] = tempScore;
        }
    });

    // Count uppercase and lowercase letters
    const uppercase = message.cleanContent.replace(/[^A-Z]/g, '').length;
    const percentage = uppercase / message.cleanContent.length;
    console.log(percentage);

    // If 50% or more of the characters are uppercase, consider it shout spam,
    // and add a score of 5, plus 1 for every 12.5 uppercase characters.
    if (percentage >= antiSpamSettings.shoutPercent * 0.01) {
        tempScore = Math.floor(5 + 20 * (uppercase / 250));
        score += tempScore;
        reasons['Uppercase / Shouting'] = tempScore;
    }

    let newstring = message.cleanContent;
    const regex = /(\W|^)(.+)\s\2/gim;
    let matcher = regex.exec(message.cleanContent);
    while (matcher !== null) {
        newstring = newstring.replace(matcher[2], ``);
        matcher = regex.exec(message.cleanContent);
    }
    const patternScore = message.cleanContent.length > 0 ? newstring.length / message.cleanContent.length : 1;

    // Pattern score of 100% means no repeating patterns. For every 4% less than 100%, add 1 score. Multiply depending on content length.
    tempScore = Math.floor(
        (1 - patternScore) * 25 * (1 + 0.1 * (message.cleanContent ? message.cleanContent.length / 100 : 0))
    );
    score += tempScore;

    if (patternScore < 1) {
        reasons['Repeating Patterns'] = tempScore;
    }

    // Executed after finishing perspective; manages multipliers
    const afterFunction = () => {
        let multiplier = antiSpamSettings.baseMultiplier;
        const isMuted = message.member && message.guild && message.member.roles.cache.get(settings.muteRole);

        // If this is not a less strict channel, add 0.5 to the multiplier.
        if (antiSpamSettings.antispamLessStrictChannels.includes(message.channel.id))
            multiplier += antiSpamSettings.lessStrictChannelMultiplier;

        // If the member does not have a role defined in less strict roles, add 0.5 to the multiplier.
        if (typeof message.member !== 'undefined') {
            let lessStrict = false;
            message.member?.roles.cache
                .filter((role) => {
                    return antiSpamSettings.antispamLessStrictRoles.indexOf(role.id) !== -1;
                })
                .each((role) => {
                    lessStrict = true;
                });
            if (!lessStrict) multiplier += antiSpamSettings.lessStrictRoleMultiplier;
        }
        if (isMuted) multiplier += antiSpamSettings.mutedMultiplier;

        // TODO: Conflict System vs AntiSpam
        score = score * multiplier;
        console.log(reasons);
        console.log(`Total score: ${score}`);

        // Flag messages with a high spam score
        const flagChannel = <TextChannel>message.client.channels.cache.get(settings.flagChannel);
        const channel = <TextChannel>message.channel;
        if (score > antiSpamSettings.decayFast) {
            if (flagChannel) {
                const embed = new MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setTitle(`⚠️ Flagged message`)
                    .setDescription(`${message.cleanContent}`)
                    .addField(
                        `Link to Message`,
                        `https://discordapp.com/channels/${message.guild!.id}/${message.channel.id}/${message.id}`
                    )
                    .addField(
                        `Total Spam Score`,
                        `Score: ${score}\nMultiplier: ${multiplier}\nTotal: ${score * multiplier}`
                    )
                    .setColor(`YELLOW`)
                    .setTimestamp()
                    .setFooter(`Message channel: ${channel.name}`);
                for (const key in reasons) {
                    if (Object.prototype.hasOwnProperty.call(reasons, key)) {
                        embed.addField(key, reasons[key]);
                    }
                }
                flagChannel.send('⚠️ A message with **__high amounts__** of Spam Score was sent!, Please Investigate', {
                    embed,
                });
            }
        }
    };
    afterFunction();
    return score;
};
