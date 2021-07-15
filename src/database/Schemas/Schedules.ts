import { Document, Schema, model } from 'mongoose';

const ScheduleSchema = new Schema({
    uid: {
        type: String,
        require: true,
        unique: true,
    },
    task: {
        type: String,
        required: true,
    },
    data: {
        type: Object,
        required: true,
    },
    lastRun: {
        type: String,
    },
    nextRun: {
        type: String,
    },
    catchUp: {
        type: Boolean,
        default: true,
    },
    cron: {
        type: String,
        default: null,
    },
});

export interface ISchedule extends Document {
    uid: string;
    task: 'removeMute' | 'removeBan' | 'minuteTask' | 'updateStats' | 'SYSMIN' | 'voteEnd';
    data: {
        user: string;
        guild: string;
        messageID?: string;
        channel?: string;
    };
    lastRun: string;
    nextRun: string;
    catchUp: Boolean;
    cron: string;
}

export const Schedules = model<ISchedule>('Schedule', ScheduleSchema);
