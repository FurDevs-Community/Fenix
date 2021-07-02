import { Snowflake } from 'discord.js';
import mongoose, { Schema } from 'mongoose';

const AutoModeration: Schema = new Schema({
    guildID: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },

    noAds: {
        type: Boolean,
        default: false,
    },

    adsPunishment: {
        type: String,
        default: 'warn',
    },

    noZalgo: {
        type: Boolean,
        default: false,
    },

    zalgoPunishment: {
        type: String,
        default: 'warn',
    },

    fishyLinks: {
        type: Boolean,
        default: false,
    },
    badNickname: {
        type: Boolean,
        default: false,
    },
    ignoreList: {
        type: JSON,
        default: [],
    },

    punishYoungAccounts: {
        type: Boolean,
        default: false,
    },

    youngAccountsPunishment: {
        type: String,
        default: 'kick',
    },

    youngAccountsTempBanDuration: {
        type: Number,
        default: 60,
    },

    punishDefaultAvatar: {
        type: Boolean,
        default: false,
    },

    defaultAvatarPunishment: {
        type: String,
        default: 'kick',
    },
    bannedWords: {
        type: Array,
        default: [
            'fuck',
            'piss',
            'nigga',
            'nigger',
            'asshole',
            'bitch',
            'slut',
            'cunt',
            'twat',
            'wanker',
            'dick',
            'whore',
        ],
    },
});

export interface IAutoModeration {
    type: string;
    noAds: boolean;
    adsPunishement: 'warn' | 'tempban' | 'ban' | 'kick';
    noZalgo: boolean;
    zalgoPunishment: 'warn' | 'tempban' | 'ban' | 'kick';
    fishyLinks: boolean;
    badNickname: boolean;
    ignoreList: Snowflake[];
    conflictTriggerThreshold: number;
    conflictTriggerDecay: number;
    punishYoungAccounts: boolean;
    punishDefaultAvatar: boolean;
    defaultAvatarPunishment: 'ban' | 'kick';
    defaultYoungAccounts: 'ban' | 'tempban' | 'kick';
    bannedWords: string[];
}

export const Automoderation = mongoose.model('AutoModeration', AutoModeration);
