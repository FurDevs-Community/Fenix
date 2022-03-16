import { ApplicationCommandData, ApplicationCommandOptionData, ChatInputApplicationCommandData, ChatInputCommandInteraction, Client, ClientOptions, Collection } from 'discord.js';
import fs from 'fs';
import * as config from '../config.json';
import BaseCommand from '../structures/BaseCommand';
import BaseInteraction from '../structures/BaseInteraction';
import { printHeader } from '../utils/printHeader';

// Extention to the Discord.js Client Class
export default class FenixClient extends Client {
    // Stores all the avaliable Interactions
    public interactions: Collection<string, BaseInteraction>;
    // Stores all the message-based commands
    public commands: Collection<string, BaseCommand>;
    // Stores the Aliases for the Commands
    public aliases: Collection<string, string>;
    // Config File so it can be referenced with the client
    public config: typeof config;
    // Array of Interactions for Discord's API
    public interactionArray: (BaseInteraction & ApplicationCommandData)[];
    constructor(clientOpts: ClientOptions) {
        super(clientOpts);
        // Initializes the good stuff
        this.commands = new Collection();
        this.interactions = new Collection();
        this.aliases = new Collection();
        this.interactionArray = [];
        // Imports the Config
        this.config = require('./../config.json');
    }

    // Loads the Interactions that are in the interactions folder
    public async loadInteractions() {
        console.info(`Loading Interactions`);
        // Runs through the categories in the interactions folder
        fs.readdirSync('dist/interactions/').forEach((category: string) => {
            console.info(`Loading Interaction Category: ${category}`);
            // Runs through the files that are in the interactions folder
            fs.readdirSync(`dist/interactions/${category}`).forEach((interaction) => {
                console.info(`Loading (/) Command: ${interaction}`);
                // Gets the individual file as a class
                const file: BaseInteraction = new (require(`../interactions/${category}/${interaction}`).default)(this);
                // Interaction Checkers
                if (!file || !file.name) return;
                // Adds it onto the interaction collection
                this.interactions.set(file.name, file);
                // Sets the defaultPermissions property to false if the interaction requires permissions
                if (file.userPermissions.length > 0 || file.ownerOnly) file.defaultPermission = false;
                // Makes an Array for the arguments for that command for Discord's API
                const commandOptions: ApplicationCommandOptionData[] = [];
                file.args?.forEach((arg) => {
                    // @ts-expect-error
                    commandOptions.push({
                        name: arg.name,
                        description: arg.description,
                        type: arg.type as any,
                        autocomplete: false,
                        choices: arg.choices,
                        options: arg.options,
                        required: arg.required,
                    });
                });
                // Adds it onto the interaction array for the Discord API
                this.interactionArray.push({
                    ...file,
                    options: commandOptions,
                    run: file.run,
                });
            });
        });
    }

    public async loadCommands() {
        console.log(`Loading Commands`);
        fs.readdirSync('dist/commands').forEach((category) => {
            console.log(`Loading Category: ${category}`);
            fs.readdirSync(`dist/commands/${category}`).forEach((command) => {
                try {
                    console.log(`Loading ${command}`);
                    const cmd = new (require(`../commands/${category}/${command}`).default)(this);
                    this.commands.set(cmd.name, cmd);
                    cmd.aliases.forEach((alias: string) => {
                        this.aliases.set(alias, cmd.name);
                    });
                    console.log(`Loaded ${cmd.name}`);
                } catch (e) {
                    console.error(`Unable to load ${command.split('.')[0]} ${e}`);
                }
            });
        });
        console.log(`Loaded All Commands`);
    }

    // Loads the events
    public async loadEvents() {
        console.info(`Loading Events`);
        // Runs through all the files in the events folder
        fs.readdirSync('dist/events/').forEach((evt: string) => {
            // Gets the event file as a class and make the bot listen to the event
            try {
                const event = new (require(`../events/${evt}`).default)(this);
                this.on(event.eventName, event.run.bind(null, this));
            } catch (e) {
                // If the bot fails to load the event then Log it
                console.error(`Error Loading ${evt.split('.')[0]} ${e}`);
            }
        });
    }

    public async login(token: string | undefined) {
        printHeader(this);
        await this.loadCommands()
        await this.loadInteractions();
        await this.loadEvents();
        return super.login(token);
    }
}
