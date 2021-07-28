import { ISchedule, Members } from '../../database';
import HozolClient from '../../lib/HozolClient';

export const task = async (client: HozolClient, record: ISchedule) => {
    if (!record) return;
    const guild = client.guilds.cache.get(record.data.guild);
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
                Members.updateOne({ userID: member.id, guildID: guild.id }, { spamScore: newSpamScore });
            }
        });
    }
    return;
};
