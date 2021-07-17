import { Message } from 'discord.js';
import HozolClient from '../../lib/HozolClient';

export const getXPScore = async (client: HozolClient, message: Message) => {
    if (!client.user || !message.guild) return;
    if (message.type !== 'DEFAULT' || message.author.id === client.user.id) return;

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
