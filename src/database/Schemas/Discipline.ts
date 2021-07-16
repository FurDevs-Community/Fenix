import mongoose, { Document, Schema } from 'mongoose';

export interface IDiscipline extends Document {
    cases: string;
    action:
        | 'XP retraction'
        | 'Coin fine'
        | 'Violation points'
        | 'Channel ban'
        | 'Role added'
        | 'Role removed'
        | 'Cannot use voice channels'
        | 'Cannot give reputation'
        | 'Cannot use staff command'
        | 'Cannot report members'
        | 'Cannot use support command'
        | 'Cannot use conflict command'
        | 'Cannot purchase ads'
        | 'Cannot edit profile'
        | 'Task'
        | 'Mute'
        | 'Ban'
        | 'Note'
        | 'Other discipline';

    description: string;
    status: 'active' | 'appealed' | 'completed';
}

const Discipline: Schema = new Schema({
    cases: {
        type: mongoose.Schema.Types.String,
        ref: 'Moderation',
    },

    action: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        maxLength: 1024,
    },

    status: {
        type: String,
        default: 'active',
        enum: ['active', 'appealed', 'completed'],
    },
});

export const Disciplines = mongoose.model<IDiscipline>('Discipline', Discipline);
