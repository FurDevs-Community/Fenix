import { TextChannel } from 'discord.js';
import mongoose, { Document, Schema } from 'mongoose';

export interface IClient extends Document {
    id: number;
    blacklisted: string[];
    maintenanceMode: boolean;
    botLogChannel: TextChannel;
    supportGuildID: TextChannel;
    botErrorsChannel: TextChannel;
}

const Client: Schema = new Schema({
    id: {
        type: Number,
        required: true,
    },
    blacklisted: {
        type: Array,
        required: true,
    },

    maintenanceMode: {
        type: Boolean,
        default: false,
    },
    supportGuildID: {
        type: String,
        default: null,
    },
    botLogChannel: {
        type: String,
        default: null,
    },
    botErrorsChannel: {
        type: String,
        default: null,
    },
});

export const Clients = mongoose.model<IClient>('Client', Client);
