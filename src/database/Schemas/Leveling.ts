import mongoose, { Schema } from 'mongoose';

const Leveling: Schema = new Schema({
    guildID: {
        type: String,
        required: true,
        unique: true,
    },

    enabled: {
        type: Boolean,
        default: false,
    },

    baseScore: {
        type: Number,
        default: 0,
    },

    multiplier: {
        type: Number,
        default: 1,
    },

    minRandomXP: {
        type: Number,
        default: 1,
    },

    maxRandomXP: {
        type: Number,
        default: 1,
    },

    attachmentXP: {
        type: Number,
        default: 2,
    },

    scorePer128Character: {
        type: Number,
        default: 1,
    },

    ignoreChannel: {
        type: Array,
        default: [],
    },

    xpCooldown: {
        type: String,
        default: '1m',
    },
});

export interface ILeveling {
    guildID: string;
    enabled: boolean;
    baseScore: number;
    multiplier: number;
    minRandomXP: number;
    maxRandomXP: number;
    attachmentXP: number;
    scorePer128Character: number;
    ignoreChannel: string[];
    xpCooldown: string;
}

export const Levelings = mongoose.model<ILeveling>('Leveling', Leveling);
