import mongoose, { Schema } from 'mongoose';
import { ISchedule } from './Schedules';

const Member: Schema = new Schema({
    reminders: {
        type: Array,
    },
});

export interface IMember extends Document {
    reminders: ISchedule[];
}

export const Members = mongoose.model<IMember>('Member', Member);
