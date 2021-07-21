import mongoose, { Schema } from 'mongoose';

const Guild: Schema = new Schema({
    guildID: {
        type: String,
        required: true,
        unique: true,
    },
    prefix: {
        type: String,
        required: true,
        default: 'J>',
    },

    disabledCommands: {
        type: Array,
        required: true,
    },
    muteRole: {
        type: String,
        default: null,
    },

    botManagerRole: {
        type: String,
        default: null,
    },

    botModRole: {
        type: String,
        default: null,
    },

    verifiedRole: {
        type: String,
        default: null,
    },

    statsMessage: {
        type: String,
        default: null,
    },

    /*
      CHANNELS
      NOTE: Update commands/channel when you change these attributes!
      */

    incidentsCategory: {
        type: String,
        default: null,
    },

    welcomeCategory: {
        type: String,
        default: null,
    },

    banLogChannel: {
        type: String,
        default: null,
    },

    kickLogChannel: {
        type: String,
        default: null,
    },

    modLogChannel: {
        type: String,
        default: null,
    },

    publicModLogChannel: {
        type: String,
        default: null,
    },

    joinLogChannel: {
        type: String,
        default: null,
    },

    leaveLogChannel: {
        type: String,
        default: null,
    },

    autoModLogChannel: {
        type: String,
        default: null,
    },

    channelLogChannel: {
        type: String,
        default: null,
    },

    statsChannel: {
        type: String,
        default: null,
    },

    messageLogChannel: {
        type: String,
        default: null,
    },

    userLogChannel: {
        type: String,
        default: null,
    },

    generalChannel: {
        type: String,
        default: null,
    },

    announcementsChannel: {
        type: String,
        default: null,
    },

    flagChannel: {
        type: String,
        default: null,
    },

    /*
      FEATURES
      */

    reputationSystem: {
        type: Boolean,
        default: false,
    },

    reputationEmoji: {
        type: String,
        default: null,
    },

    selfModeration: {
        type: Number,
        default: 0,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value',
        },
    },

    selfModerationMinutes: {
        type: Number,
        default: 60,
        min: 1,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value',
        },
    },

    vptDecayXP: {
        type: Number,
        default: 0,
        min: 0,
    },

    vptDecayHours: {
        type: Number,
        default: 0,
        min: 0,
    },

    welcomeIncidentText: {
        type: String,
        maxLength: 1950,
        default: null,
    },

    appealFormLink: {
        type: String,
        maxLength: 1950,
        default: null,
    },

    compactLogging: {
        type: Boolean,
        default: false,
    },

    defaultVPTSOnWarn: {
        type: Number,
        default: 40,
    },

    conflictSystem: {
        type: Boolean,
        default: false,
    },

    conflictTriggerThreshold: {
        type: Number,
        default: 0,
    },

    conflictTriggerDecay: {
        type: Number,
        default: 0,
    },

    awaySystem: {
        type: Boolean,
        default: true,
    },

    rulesSpecify: {
        type: String,
        enum: ['required', 'optional', 'ignore'],
        default: 'ignore',
    },

    reasonSpecify: {
        type: String,
        enum: ['required', 'optional', 'ignore'],
        default: 'ignore',
    },

    messagesSent24hr: {
        type: Number,
        default: 0,
    },

    messagesCountHistory: {
        type: Array,
        default: [],
    },

    welcomeMessage: {
        type: String,
        default: 'Welcome %username% to %guild%! Please make sure you read the rules',
    },

    verificationMethod: {
        type: String,
        default: 'manual',
    },

    sendWelcomeMessage: {
        type: Boolean,
        default: false,
    },

    currency: {
        type: String,
        default: '$',
    },

    logLoggings: {
        type: Boolean,
        default: true,
    },

    levelingMsg: {
        type: String,
        default: 'Channel',
    },
});

export interface IGuild extends Document {
    welcomeCategory: string;
    guildID: string;
    prefix: string;
    disabledCommands: string[];
    muteRole: string;
    botManagerRole: string;
    botModRole: string;
    verifiedRole: string;
    messagesSent24hr: number;
    messagesCountHistory: { day: string; count: number }[];
    incidentsCategory: string;
    banLogChannel: string;
    kickLogChannel: string;
    modLogChannel: string;
    publicModLogChannel: string;
    currency: string;
    joinLogChannel: string;
    leaveLogChannel: string;
    autoModLogChannel: string;
    channelLogChannel: string;
    messageLogChannel: string;
    statsChannel: string;
    statsMessage: string;
    userLogChannel: string;
    generalChannel: string;
    announcementsChannel: string;
    reputationSystem: boolean;
    reputationEmoji: string;
    selfModeration: number;
    levelingMsg: 'Channel' | 'DM' | string;
    selfModerationMintes: number;
    flagChannel: string;
    vptDecayXP: number;
    vptDecayHours: number;
    welcomeIncidentText: string;
    appealFormLink: string;
    compactLogging: string;
    awaySystem: boolean;
    rulesSpecify: 'required' | 'optional' | 'ignore';
    reasonSpecify: 'required' | 'optional' | 'ignore';
    welcomeMessage: string;
    verificationMethod: 'incidents' | 'manual' | 'email' | 'puzzle' | 'captcha';
    sendWelcomeMessage: boolean;
    logLoggings: boolean;
    // TODO: conflictSystem
}

export const Guilds = mongoose.model<IGuild>('Guild', Guild);
