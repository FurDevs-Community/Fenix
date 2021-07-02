import mongoose, { Schema } from 'mongoose';

const Profile: Schema = new Schema({
    guildID: {
        type: String,
        required: true,
    },

    userID: {
        type: String,
        required: true,
    },

    title: {
        type: String,
        maxLength: 64,
        default: null,
    },

    image: {
        type: String,
        default: null,
    },

    badges: {
        type: Array,
    },

    reputation: {
        type: Number,
        default: 0,
    },

    socialMedia: {
        type: Array,
    },

    information: {
        type: String,
        maxLength: 4096,
    },
});

export interface IProfile extends Document {
    guildID: string;
    userID: string;
    title: string;
    image: string;
    badges: object[];
    reputation: number;
    socialMedia: object[];
    information: string;
}

export const Profiles = mongoose.model<IProfile>('Profile', Profile);
