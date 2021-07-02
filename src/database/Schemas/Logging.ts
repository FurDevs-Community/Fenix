import mongoose, { Schema } from 'mongoose';

const Logging: Schema = new Schema({
    logID: {
        type: String,
        required: true,
        unique: true,
    },
    // TODO: Decide what should go here
});

export const Loggings = mongoose.model('Logging', Logging);
