import { Message } from 'discord.js';

/**
 * Gets the amount of XP the message sent is worth
 *
 * @param message Message being sent
 * @returns The amount of XP the message provided is worth
 */
export const getXPScore = async (message: Message) => {
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

/**
 * Calculates the Level based on the XP provided
 *
 * @param xp The amount of XP you want to see how much levels it's worth
 * @returns The Level the XP is worth
 */
export const getLevelFromXP = (xp: number) => {
    // Calculates the level from xp
    return Math.floor(0.177 * Math.sqrt(xp)) + 1;
};

/**
 * This function will calculate the amount of XP needed in order to reach the specified level
 *
 * @param level Amount of Levels you would want to see how much xp will it take
 * @returns The Amount of XP needed to reach this leve
 */
export const getXPFromLevel = (level: number) => {
    // Calculates the xp from level
    return Math.floor(Math.pow((level - 1) / 0.177, 2));
};
