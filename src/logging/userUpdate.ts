import { Event } from 'nukejs';
import { send } from '../helper';
import { MessageEmbed, User } from 'discord.js';
import HozolClient from '../lib/HozolClient';

module.exports = class extends Event {
    constructor() {
        super({
            name: 'userUpdate',
            enabled: true,
        });
    }

    async run(oldUser: User, newUser: User) {
        const client = <HozolClient>newUser.client;
        // Get the full user if a partial
        if (newUser.partial) {
            await newUser.fetch();
        }

        // Add event logs to guilds if things changed
        // Note: We do not have to broadcastEval because every shard will get this event
        client.guilds.cache
            .filter(
                (guild) =>
                    guild.members.resolve(newUser.id) as unknown as boolean
            )
            .each(async (guild) => {
                // Add an event log if the user's tag changed
                if (!oldUser.partial && oldUser.tag !== newUser.tag) {
                    const userTag = new MessageEmbed()
                        .setAuthor(
                            `${newUser.tag}`,
                            `${newUser.displayAvatarURL({ dynamic: true })}`
                        )
                        .setTitle(
                            ':star_struck: A member changed their username/tag.'
                        )
                        .addField('Old Username', `${oldUser.tag}`)
                        .addField('New Username', `${newUser.tag}`)
                        .setColor('#6610f2')
                        .setTimestamp()
                        .setFooter(`User ID: ${newUser.id}`);
                    await send('userLogChannel', guild, '', {
                        embed: userTag,
                    });
                }

                // Add an event log if the user's avatar changed
                if (!oldUser.partial && oldUser.avatar !== newUser.avatar) {
                    const avatarTag = new MessageEmbed()
                        .setAuthor(
                            `${newUser.tag}`,
                            `${newUser.displayAvatarURL({ dynamic: true })}`
                        )
                        .setTitle(
                            ':face_with_monocle: A member changed their avatar.'
                        )
                        .setDescription(
                            'Old avatar is at the bottom. New avatar is in the thumbnail.'
                        )
                        .setColor('#6610f2')
                        .setTimestamp()
                        .setFooter(
                            `User ID: ${newUser.id}`,
                            `${oldUser.displayAvatarURL({ dynamic: true })}`
                        )
                        .setThumbnail(
                            `${newUser.displayAvatarURL({ dynamic: true })}`
                        );
                    await send('userLogChannel', guild, '', {
                        embed: avatarTag,
                    });
                }
            });
    }
};
