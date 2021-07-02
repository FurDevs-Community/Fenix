import mongoose, { Document } from 'mongoose';

const ScheduleSchema = new mongoose.Schema({
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
    task: 'removeMute' | 'removeBan' | 'minuteTask' | 'updateStats' | 'SYSMIN';
    data: {
        user: string;
        guild: string;
    };
    lastRun: string;
    nextRun: string;
    catchUp: Boolean;
    cron: string;
}

// When it gets created
// ScheduleSchema.methods.schedule = () => {

// };
// ScheduleSchema.queue("schedule", []);

// ScheduleSchema.post("updateOne", async function (res, next) {
//     // TODO: Re-Schedule the schedule
//     return next();
// });

// ScheduleSchema.post("remove", async function (res, next) {
//     // TODO: Remove the schedule
//     return next();
// });

export const Schedules = mongoose.model<ISchedule>('Schedule', ScheduleSchema);
