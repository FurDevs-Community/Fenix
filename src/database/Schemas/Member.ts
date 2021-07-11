import mongoose, { Schema } from 'mongoose';

const Member: Schema = new Schema({
    guildID: {
        type: String,
    },
    userID: {
        type: String,
    },
    vpts: {
        type: Number,
        default: 0,
    },
    roles: {
        type: Array,
        default: [],
    },

    spamScore: {
        type: Number,
        default: 0,
    },

    spamScoreStamp: {
        type: Date,
        default: 0,
    },

    muted: {
        type: Boolean,
        default: false,
    },

    reports: {
        type: Array,
        default: [],
    },
    notes: {
        type: Array,
        default: [],
    },

    awayStatus: {
        type: String,
        default: '',
    },
});

export interface IMember extends Document {
    guildID: string;
    userID: string;
    vpts: number;
    roles: string[];
    spamScore: number;
    spamScoreStamp: string;
    muted: boolean;
    reports: string[];
    notes: string[];
    awayStatus: string;
}

export const Members = mongoose.model<IMember>('Member', Member);
