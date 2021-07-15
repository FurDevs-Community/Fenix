import mongoose, { Schema } from 'mongoose';
import { ISchedule } from './Schedules';

const User: Schema = new Schema({
    reminders: {
        type: Array,
    },
});

export interface IUser extends Document {
    reminders: ISchedule[];
}

export const Users = mongoose.model<IUser>('User', User);
