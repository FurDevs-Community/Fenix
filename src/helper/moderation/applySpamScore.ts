// TODO: Guild Allow Warn for first time & Customized Punishments
// TODO: Exclude Staff Members
import { Message } from 'discord.js';
import moment from 'moment-timezone';
import { Members } from '../../database';
import { send } from '../guild/send';
import { IssueDiscipline } from './incidents';

export const applySpamScore = async (message: Message, amount: number) => {
    if (!message.member) return;
    if (!message.guild) return;
    if (message.author.bot) return;

    // Guild Settings, Member Settings and etc
    // const guildSettings = await message.guild.settings();
    const memberSettings = await message.member.settings();
    const antiSpamSettings = await message.guild.antispam();
    const guildSettings = await message.guild.settings();

    // Spam Scores & Add Spam Score
    const muted = memberSettings.muted;

    const previousScore = memberSettings.spamScore;
    const newScore = memberSettings.spamScore + amount;
    const threshold = antiSpamSettings.threshold;
    const timestamp = memberSettings.spamScoreStamp;
    await Members.updateOne({ guildID: message.guild.id, userID: message.author.id }, { spamScore: newScore });
    if (
        (antiSpamSettings.warnAfterFirstASTrigger &&
            previousScore < threshold &&
            newScore >= threshold &&
            timestamp === null) ||
        moment().subtract(1, 'minute').isAfter(timestamp)
    ) {
        if (!guildSettings.muteRole) {
            send(
                'announcementsChannel',
                message.guild,
                '**HEY STAFF!** I cannot punish users for antispam if the mute role is not setup/deleted (or misconfigured) ',
                {}
            );
            return;
        }
        message.channel.send(
            `⚠️ **ANTISPAM** - Heya ${
                message.member
            } can you stop triggering the antispam system. Failure to do so within the next ${moment.duration(
                antiSpamSettings.decayFast > 0 ? newScore / antiSpamSettings.decayFast + 1 : 0,
                'minute'
            )} minute(s) will lead you into getting ${
                muted ? 'Getting Kick out of the server' : 'Getting muted in the server indefinitly'
            }`
        );
        await Members.updateOne(
            { guildID: message.guild.id, userID: message.author.id },
            { spamScoreStamp: moment().toISOString(true) }
        );
    } else if (previousScore >= threshold) {
        if (!guildSettings.muteRole) {
            send(
                'announcementsChannel',
                message.guild,
                '**HEY STAFF!** I cannot punish users for antispam if the mute role is not setup/deleted (or misconfigured) ',
                {}
            );
            return;
        }
        if (antiSpamSettings.warnAfterFirstASTrigger) {
            if (moment().subtract(5, 'seconds').isAfter(moment(memberSettings.spamScoreStamp))) {
                if (muted) {
                    const autoMod = new IssueDiscipline(message.author, message.guild, message.client.user!);
                    await autoMod.initialize();
                    await autoMod.kickUser();
                    await autoMod.finish();
                    message.channel.send(
                        `✅ ${message.member} is now kicked out of the server (since they are muted). You may now continue chat in peace :)`
                    );
                } else {
                    const autoMod = new IssueDiscipline(message.author, message.guild, message.client.user!);
                    await autoMod.initialize();
                    await autoMod.antiSpam();
                    await autoMod.finish();
                    message.channel.send(
                        `✅ ${message.member} is now muted indefintly. You may now continue chat in peace :)`
                    );
                }
            }
        } else {
            const autoMod = new IssueDiscipline(message.author, message.guild, message.client.user!);
            await autoMod.initialize();
            await autoMod.antiSpam();
            await autoMod.finish();
            message.channel.send(`✅ ${message.member} is now muted indefintly. You may now continue chat in peace :)`);
        }
    }
};
