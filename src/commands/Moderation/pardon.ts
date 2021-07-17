import HozolClient from '../../lib/HozolClient';
import { MessageEmbed, User } from 'discord.js';
import { Message } from 'discord.js';
import { Command } from 'nukejs';
import { IModeration, Moderations } from './../../database';
import { askQuestion } from '../../helper/moderation/askRules';
import { usernameResolver } from '../../helper/resolvers/usernameResolver';
import { primaryColor } from '../../settings';

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: 'pardon',
            category: 'Moderation',
            runIn: ['text'],
            userPerms: ['MANAGE_MESSAGES'],
            aliases: [],
            cooldown: 0,
            description: `Pardon a member's warning`,
            enabled: true,
            ignoredInhibitors: [],
        });
    }
    /**
     * @param message
     * @param args
     * @param client
     */
    async run(message: Message, args: string[], client: HozolClient) {
        if (!message.guild) return;
        const user = await usernameResolver(message, args[0]);
        const userModerations = await user.guildModeration(message.guild.id);
        if (!args[1]) {
            const embed = new MessageEmbed()
                .setTitle(`**__${user.username} Warnings on record__**`)
                .setDescription(
                    `What warning would you like to pardon? Send the case UID in your next message or \`cancel\` to cancel`
                )
                .setColor(primaryColor);
            const allowedCases: string[] = [];
            userModerations.map((moderation: IModeration) => {
                allowedCases.push(moderation.cases);
                embed.addField(
                    `[Case: ${moderation.cases}] | ${moderation.type}`,
                    `Rules: ${moderation.rules} / Reason: ${moderation.reason}`
                );
            });
            embed.setTimestamp().setFooter(`User ID: ${message.author.id}`);
            const [msg, response] = <Message[]>await askQuestion(message, embed);
            if (response.content.toLowerCase() === 'cancel') {
                msg.delete();
            } else {
                if (allowedCases.includes(response.content)) {
                    await pardonCase(message, user, response.content);
                } else {
                    let success = false;
                    while (!success) {
                        const [newMsg, newResponse] = <Message[]>(
                            await askQuestion(
                                message,
                                "That case doesn't exist, try again, You may look at the embed above"
                            )
                        );
                        if (allowedCases.includes(newResponse.content)) {
                            await pardonCase(message, user, newResponse.content);
                            success = true;
                            newMsg.delete();
                        }
                    }
                }
            }
        } else {
            const allowedCases: string[] = [];
            userModerations.map((moderation: IModeration) => {
                allowedCases.push(moderation.cases);
            });

            if (allowedCases.includes(args[1])) {
                await pardonCase(message, user, args[1]);
            } else {
                const success = false;
                while (!success) {
                    const [newMsg] = <Message[]>await askQuestion(message, "That case doesn't exist, try again");
                    newMsg.delete();
                }
            }
        }
    }
};

const pardonCase = async (message: Message, user: User, caseUID: string) => {
    if (!message.guild) return;
    const memberModeration = await Moderations.findOne({
        guildID: message.guild.id,
        userID: user.id,
        cases: caseUID,
    });
    console.log(memberModeration);
    if (memberModeration) {
        await memberModeration.delete();
    } else {
        throw new Error('We had a problem trying to pardon this warning, please contact a developer');
    }
    message.channel.send(`Case ${caseUID} has been pardoned`);
};
