import { Snowflake } from 'discord.js';
import { model, Schema } from 'mongoose';

export interface IAntiRaid {
    guildID: Snowflake;
    score: number;
    welcomeGate: boolean;
    inviteWipe: boolean;
    lockdown: boolean;
    indefiniteMute: boolean;
    phoneVerificationThreshold: number;
    phoneVerification: boolean;
    welcomeGateThreshold: number;
    inviteWipeThreshold: number;
    lockdownThreshold: number;
    indefiniteMuteThreshold: number;
    decay: number;
    newMemberScore: number;
    warnScore: number;
    muteScore: number;
    banScore: number;
    antispamScore: number;
}

const AntiRaid: Schema = new Schema({
    guildID: {
        type: String,
        required: true,
        unique: true,
    },
    score: {
        type: Number,
        min: 0,
        default: 0,
    },

    // This may be removed in the future with the incidents welcome channel system we have.
    welcomeGate: {
        type: Boolean,
        default: false,
    },

    inviteWipe: {
        type: Boolean,
        default: false,
    },

    lockdown: {
        type: Boolean,
        default: false,
    },

    indefiniteMute: {
        type: Boolean,
        default: false,
    },

    phoneVerification: {
        type: Boolean,
        default: false,
    },

    /*
      SETTINGS - THRESHOLDS
      */

    phoneVerificationThreshold: {
        type: Number,
        default: 0,
        min: 0,
    },

    welcomeGateThreshold: {
        type: Number,
        default: 0,
        min: 0,
    },

    inviteWipeThreshold: {
        type: Number,
        default: 0,
        min: 0,
    },

    lockdownThreshold: {
        type: Number,
        default: 0,
        min: 0,
    },

    indefiniteMuteThreshold: {
        type: Number,
        default: 0,
        min: 0,
    },

    /*
      SETTINGS - SCORES
      */

    decay: {
        type: Number,
        min: 0,
        default: 1,
    },

    newMemberScore: {
        type: Number,
        min: 0,
        default: 0,
    },

    warnScore: {
        type: Number,
        min: 0,
        default: 0,
    },

    muteScore: {
        type: Number,
        min: 0,
        default: 0,
    },

    banScore: {
        type: Number,
        min: 0,
        default: 0,
    },

    antispamScore: {
        type: Number,
        default: 0,
        min: 0,
    },
});

export const AntiRaids = model('AntiRaid', AntiRaid);
