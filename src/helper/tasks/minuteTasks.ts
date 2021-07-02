import { Guild } from 'discord.js';
import { Members } from '../../database';
import HozolClient from '../../lib/HozolClient';

export const minuteTasks = async (client: HozolClient, guild: Guild) => {
    if (guild && guild.available) {
        const antiRaidSettings = await guild.antiraid();
        const antiSpamSettings = await guild.antispam();
        guild.members.cache.forEach(async (member) => {
            const memberSettings = await member.settings();
            if (memberSettings.spamScore > 0) {
                let newSpamScore = memberSettings.spamScore;
                if (antiRaidSettings.lockdown) {
                    newSpamScore -= antiSpamSettings.decaySlow;
                } else {
                    newSpamScore -= antiSpamSettings.decayFast;
                }
                if (newSpamScore < 0) {
                    newSpamScore = 0;
                }
                // Update User's Data
                Members.updateOne(
                    { userID: member.id, guildID: guild.id },
                    { spamScore: newSpamScore }
                );
            }
        });
    }
};
