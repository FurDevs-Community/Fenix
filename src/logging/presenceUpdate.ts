/* eslint-disable require-jsdoc */
import { Event } from 'nukejs';
import { send } from '../helper';
import { MessageEmbed, Presence } from 'discord.js';

import _ from 'lodash';

module.exports = class extends Event {
    constructor() {
        super({
            name: 'presenceUpdate',
            enabled: true,
        });
    }

    async run(oldPresence: Presence, newPresence: Presence) {
        // ! Tooo spammy forgot to disable
        return;
        // Skip bots; they often cycle through presences to display stats
        if (newPresence.user?.bot) return;

        const oldActivities = oldPresence
            ? oldPresence.activities.map((activity) => {
                  return {
                      emoji: activity.emoji,
                      name: activity.name,
                      details: activity.details,
                  };
              })
            : [];
        const newActivities = newPresence
            ? newPresence.activities.map((activity) => {
                  return {
                      emoji: activity.emoji,
                      name: activity.name,
                      details: activity.details,
                  };
              })
            : [];

        if (!_.isEqual(_.sortBy(oldActivities), _.sortBy(newActivities))) {
            const activityTag = new MessageEmbed()
                .setAuthor(`${newPresence.user?.tag}`, `${newPresence.user?.displayAvatarURL({ dynamic: true })}`)
                .setTitle(':video_game: A member changed their presence / status.')
                .addField('Old Presence', `\`\`\`${JSON.stringify(oldActivities)}\`\`\``)
                .addField('New Presence', `\`\`\`${JSON.stringify(newActivities)}\`\`\``)
                .setColor('#6610f2')
                .setTimestamp()
                .setFooter(`User ID: ${newPresence.user?.id}`);
            // @ts-ignore
            await send('userLogChannel', newPresence.guild, '', {
                embed: activityTag,
            });
        }
    }
};
