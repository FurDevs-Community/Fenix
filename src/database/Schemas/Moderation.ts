import mongoose, { Document, Schema } from 'mongoose';

const Moderation: Schema = new Schema({
    cases: {
        type: String,
        required: true,
    },

    guildID: {
        type: String,
        required: true,
    },

    userID: {
        type: String,
        required: true,
    },

    issuer: {
        type: String,
        required: true,
    },

    type: {
        type: String,
        require: true,
    },

    appealed: {
        type: Boolean,
        default: false,
    },

    rules: {
        type: Array,
    },

    reason: {
        type: String,
        maxLength: 1024,
    },

    discipline: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Discipline',
        },
    ],
});

export interface IModeration extends Document {
    length: any;
    cases: string;
    guildID: string;
    userID: string;
    issuer: string;
    appealed: boolean;
    rules: number[];
    reason: string;
    type:
        | 'note'
        | 'warning'
        | 'discipline'
        | 'antispam'
        | 'task'
        | 'restriction'
        | 'kick'
        | 'ban'
        | 'discord-ban'
        | 'investigation'
        | null;
}

export const Moderations = mongoose.model<IModeration>(
    'Moderation',
    Moderation
);
