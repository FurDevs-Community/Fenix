import mongoose, { Schema } from 'mongoose';

const Badges: Schema = new Schema({
    uid: {
        type: String,
        required: true,
        unique: true,
    },

    active: {
        type: Boolean,
        default: true,
    },

    guildID: {
        type: String,
        required: true,
    },

    name: {
        type: String,
        required: true,
    },

    image: {
        type: String,
        required: true,
    },

    howToEarn: {
        type: String,
        default: null,
        maxlength: 2000,
    },

    price: {
        type: Number,
        min: 0,
        required: true,
    },
});

export const Badge = mongoose.model('Badges', Badges);
