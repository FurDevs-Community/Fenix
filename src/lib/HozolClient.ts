/* eslint-disable prettier/prettier */
/* eslint-disable require-jsdoc */
/* eslint-disable prettier/prettier */
import {
    Client,
    Command,
    CommandLoader,
    EventLoader,
    NukeClientOptions,
    InhibitorLoader,
} from 'nukejs';
import { blue, cyan } from 'chalk';
import mongoose, { Connection } from 'mongoose';
import { Collection, Snowflake } from 'discord.js';
import moment from 'moment-timezone';
import { defaultPrefix, port } from './../settings';
import winston, { Logger } from 'winston';

// This extends the client to have more propeties

export default class HozolClient extends Client {
    public schedules: any;
    public mongo: Connection;
    public moment: any;
    public port: Number;
    public loader: CommandLoader;
    public commands: Collection<string, Command>;
    public developers: Snowflake[];
    public owners: Snowflake[];
    public logEventLoader: EventLoader;
    public eventLoader: EventLoader;
    public inhibitorLoader: InhibitorLoader;
    public logger: Logger;
    public constructor(options: NukeClientOptions) {
        super(options);
        this.schedules = {};
        this.moment = moment;
        this.port = port;
        this.loader = new CommandLoader(this, {
            allowMention: true,
            directory: './dist/commands',
            prefix: async (message) => {
                if (!message.guild) return defaultPrefix;
                const gSettings = await message.guild.settings();
                if (gSettings) {
                    return gSettings.prefix;
                } else {
                    return defaultPrefix;
                }
            },
            blockBot: true,
            blockClient: true,
        });
        this.logEventLoader = new EventLoader(this, {
            directory: './dist/events',
            extensions: ['js'],
        });
        this.eventLoader = new EventLoader(this, {
            directory: './dist/logging',
            extensions: ['js'],
        });
        this.inhibitorLoader = new InhibitorLoader(this, {
            directory: './dist/inhibitors',
        });
        this.commands = this.loader.Commands;
        this.developers = ['679145795714416661'];
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.json(),
            defaultMeta: { service: 'user-service' },
            transports: [
                new winston.transports.File({
                    filename: 'logs/error.log',
                    level: 'error',
                }),
                new winston.transports.File({ filename: 'logs/combined.log' }),
            ],
        });
    }

    async connectDB(db: any) {
        // Connect to the Mongo database
        await mongoose
            .connect(db, {
                useUnifiedTopology: true,
                useNewUrlParser: true,
                useCreateIndex: true,
                useFindAndModify: false,
            })
            .then(() => {
                this.log('Connected to the Database');
            })
            .catch((err) => {
                this.error('An Database Error Occured!\n' + err);
                return process.exit();
            });
    }

    async log(msg: any) {
        console.log(`${cyan('[')}${blue('Hozol - Log')}${cyan(']')} ${msg}`);
        this.logger.log('info', msg);
    }

    async warn(msg: any) {
        console.log(`${cyan('[')}${blue('Hozol - Warn')}${cyan(']')} ${msg}`);
        this.logger.warn('warn', msg);
    }

    async error(msg: any) {
        console.log(`${cyan('[')}${blue('Hozol - Error')}${cyan(']')} ${msg}`);
        this.logger.error('error', msg);
    }

    async debug(msg: any) {
        console.log(`${cyan('[')}${blue('Hozol - Debug')}${cyan(']')} ${msg}`);
        this.logger.debug('debug', msg);
    }
}
