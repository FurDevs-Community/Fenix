import { Message } from 'discord.js';
import HozolClient from '../../lib/HozolClient';

export const getXPScore = async (client: HozolClient, message: Message) => {
    if (!message.guild) return;
    // Settings
    const leveling = await message.guild.leveling();
    let score = leveling.baseScore;

    // Calculates XP based on message length
    score += (message.content.length / 128) * leveling.scorePer128Character;

    // Calculates XP based on attachments
    if (message.attachments) score += leveling.attachmentXP;

    // Calculates XP based on min/max XP
    score += Math.random() * (leveling.maxRandomXP - leveling.minRandomXP) + leveling.minRandomXP;

    score = Math.floor(score * leveling.multiplier);

    return score;
};

export const getLevelFromXP = (xp: number) => {
    // Calculates the level from xp
    return Math.floor(0.177 * Math.sqrt(xp)) + 1;
};
