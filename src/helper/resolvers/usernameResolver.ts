import { Guild, GuildMember, Message, MessageEmbed, User } from 'discord.js';

import { DiscordMenu } from '..';
import { primaryColor } from '../../settings';

const { userResolver } = require('./../resolvers/userResolver');
const userOrMemberRegex = /^(?:<@!?)?(\d{17,19})>?$/;
const _ = require('lodash');

export async function usernameResolver(
    message: Message,
    username: string
): Promise<User> {
    if (!username) throw new Error('Username was not provided');
    const regExpEsc = (str: string) =>
        str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

    if (!message.guild) {
        return userResolver(username);
    }
    const resUser = await resolveUser(username, message.guild);
    if (resUser) return resUser;

    const results = [];
    const reg = new RegExp(regExpEsc(username), 'i');
    for (const member of message.guild.members.cache.values()) {
        if (reg.test(member.user.username)) {
            results.push(member.user);
        } else if (reg.test(member.nickname!)) {
            results.push(member.user);
        }
    }

    let querySearch: any;
    if (results.length > 0) {
        const regWord = new RegExp(`\\b${regExpEsc(username)}\\b`, 'i');
        const filtered = results.filter((user) => regWord.test(user.username));
        querySearch = filtered.length > 0 ? filtered : results;
    } else {
        querySearch = results;
    }

    switch (querySearch.length) {
        case 0:
            throw new Error(
                `Sorry, I could not find any users matching the criteria provided for ${username}. Please make sure you provided a valid username, nickname, mention, or id.`
            );
        case 1:
            return querySearch[0];
        default:
            return await new Promise(async (resolve, reject) => {
                const children: any = [];
                let _children: any = [];
                const children2: any = [];
                const childrenMain: any = [];
                querySearch.forEach((option: string) => {
                    children.push(option);
                    childrenMain.push(option);
                });

                // Now, break the roles up into groups of 10 for pagination.
                while (children.length > 0) {
                    _children.push(children.shift());
                    if (_children.length > 9) {
                        children2.push(_.cloneDeep(_children));
                        _children = [];
                    }
                }
                if (_children.length > 0) {
                    children2.push(_.cloneDeep(_children));
                }

                new DiscordMenu(
                    message.channel,
                    message.author.id,
                    children2.map((group: any) => {
                        const groupEmbed = new MessageEmbed()
                            .setAuthor(
                                `${message.author.tag}`,
                                `${message.author.displayAvatarURL({
                                    dynamic: true,
                                })}`
                            )
                            .setTitle('Multiple users found!')
                            .setDescription(
                                `Multiple users matched the name "**${username}**". Use the menu to find which user you meant, and then type their name in a message.`
                            )
                            .setColor(primaryColor)
                            .setFooter(`User ID: ${message.author.id}`)
                            .setTimestamp();
                        group.map((child: User) => {
                            groupEmbed.addField(
                                child.username,
                                `ID: ${child.id}`
                            );
                        });
                        return groupEmbed;
                    }),
                    childrenMain.map((child: User) => {
                        return {
                            message: child.username,
                            fn: (senderMessage: Message) => {
                                senderMessage.delete();
                                return resolve(child);
                            },
                        };
                    })
                );
            });
    }
}

function resolveUser(query: any, guild: Guild) {
    if (query instanceof GuildMember) return query.user;
    if (query instanceof User) return query;
    if (typeof query === 'string') {
        if (userOrMemberRegex.test(query)) {
            return guild.client.users
                .fetch(userOrMemberRegex.exec(query)![1])
                .catch(() => null);
        }
        if (/\w{1,32}#\d{4}/.test(query)) {
            const res = guild.members.cache.find(
                (member: GuildMember) => member.user.tag === query
            );
            return res ? res.user : null;
        }
    }
    return null;
}
