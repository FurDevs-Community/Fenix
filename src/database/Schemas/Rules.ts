import mongoose, { Schema } from 'mongoose';

const Rules: Schema = new Schema({
    guildID: {
        type: String,
        required: true,
    },

    number: {
        type: Number,
        required: true,
    },

    short: {
        type: String,
        required: true,
        maxLength: 255,
    },

    long: {
        type: String,
        allowNull: true,
        maxLength: 2000,
    },
});

export interface IRules {
    guildID: string;
    number: number;
    short: string;
    long: string;
}

export const Rule = mongoose.model('Rules', Rules);
