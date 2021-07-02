import mongoose, { Schema } from 'mongoose';

const AntiSpam: Schema = new Schema({
    guildID: {
        type: String,
        required: true,
        unique: true,
    },

    /*
      BASIC SETTINGS
      */

    enabled: {
        type: Boolean,
        default: false,
    },

    flagThreshold: {
        type: Number,
        default: 30,
    },

    threshold: {
        type: Number,
        default: 100,
    },

    decayFast: {
        type: Number,
        default: 33,
        min: 0,
    },

    decaySlow: {
        type: Number,
        default: 1,
        min: 0,
    },

    /*
      FAST SCORE SETTINGS
      */

    mutedMultiplier: {
        type: Number,
        min: 0,
        default: 1.5,
    },

    baseMultiplier: {
        type: Number,
        min: 0,
        default: 0.5,
    },

    lessStrictRoleMultiplier: {
        type: Number,
        min: 0,
        default: 0.75,
    },

    lessStrictChannelMultiplier: {
        type: Number,
        min: 0,
        default: 0.75,
    },

    baseScore: {
        type: Number,
        min: 0,
        default: 1,
    },

    mentionScore: {
        type: Number,
        min: 0,
        default: 5,
    },

    everyoneHereScore: {
        type: Number,
        min: 0,
        default: 25,
    },

    embedsScore: {
        type: Number,
        min: 0,
        default: 5,
    },

    attachmentScore: {
        type: Number,
        min: 0,
        default: 10,
    },

    charactersPerSecond: {
        type: Number,
        min: 0,
        default: 10,
    },

    messageHistoryMinutes: {
        type: Number,
        min: 0,
        default: 3,
    },

    similarityPercent: {
        type: Number,
        min: 0,
        max: 100,
        default: 80,
    },

    similarityScore: {
        type: Number,
        min: 0,
        default: 64,
    },

    shoutPercent: {
        type: Number,
        min: 0,
        max: 100,
        default: 50,
    },

    shoutScore: {
        type: Number,
        min: 0,
        default: 10,
    },

    repeatCharacters: {
        type: Number,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value',
        },
        default: 5,
    },

    repeatCharactersScore: {
        type: Number,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value',
        },
        default: 3,
    },

    newLinesAllowedPerCharacters: {
        type: Number,
        min: 0,
        default: 128,
    },

    newLinesScore: {
        type: Number,
        min: 0,
        default: 3,
    },

    originalityPercent: {
        type: Number,
        min: 0,
        max: 100,
        default: 80,
    },

    profanityScore: {
        type: Number,
        min: 0,
        default: 3,
    },

    antispamLessStrictChannels: {
        type: Array,
        default: [],
    },

    antispamLessStrictRoles: {
        type: Array,
        default: [],
    },

    ignoreList: {
        type: Array,
        default: [],
    },

    warnAfterFirstASTrigger: {
        type: Boolean,
        default: true,
    },
});

export interface IAntiSpam {
    guildID: string;
    baseMultiplier: number;
    ignoreList: any[];
    antispamLessStrictChannels: any[];
    antispamLessStrictRoles: any[];
    enabled: boolean;
    flagThreshold: number;
    flagChannel: string;
    threshold: number;
    decayFast: number;
    decaySlow: number;
    mutedMultiplier: number;
    lessStrictRoleMultiplier: number;
    lessStrictChannelMultiplier: number;
    baseScore: number;
    mentionScore: number;
    everyoneHereScore: number;
    embedsScore: number;
    attachmentScore: number;
    charactersPerSecond: number;
    messageHistoryMinutes: number;
    similarityPercent: number;
    similarityScore: number;
    shoutPercent: number;
    shoutScore: number;
    repeatCharacters: number;
    repeatCharactersScore: number;
    newLinesAllowedPerCharacters: number;
    newLinesScore: number;
    originalityPercent: number;
    profanityScore: number;
    warnAfterFirstASTrigger: boolean;
}

export const AntiSpams = mongoose.model('AntiSpam', AntiSpam);
