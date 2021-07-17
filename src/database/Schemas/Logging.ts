import mongoose, { Schema } from 'mongoose';

const Logging: Schema = new Schema({
    logID: {
        type: String,
        required: true,
        unique: true,
    },

    logType: {
        type: String,
        required: true,
    },

    logInfo: {
        type: String,
        required: true,
    },

    thumbnail: {
        type: String,
        required: true,
    },

    responsible: {
        type: String,
    },
});

interface ILogging extends Document {
    logID: string;
    logType:
        | 'Channel Create'
        | 'Channel Delete'
        | 'Channel Update'
        | 'Member Banned'
        | 'Member Unbanned'
        | 'Message Bulk Delete'
        | 'Message Delete'
        | 'Message Update'
        | 'Presence Update'
        | 'User Update';
    logInfo: string;
    thumbnail: string;
    responsible: string;
}

export const Loggings = mongoose.model<ILogging>('Logging', Logging);
