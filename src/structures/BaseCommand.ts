import { Message, PermissionResolvable } from 'discord.js';
import FenixClient from '../lib/FenixClient';

export default abstract class BaseInteraction {
    public client: FenixClient;
    public name: string;
    public description: string;
    public aliases: string[];
    public examples: string[];
    public userPermissions: Array<PermissionResolvable>;
    public botPermissions: Array<PermissionResolvable>;
    public category: string;
    constructor(client: FenixClient, options: ICommandOptions) {
        this.client = client;
        this.name = options.name;
        this.category = options.category;
        this.aliases = options.aliases || [];
        this.botPermissions = options.botPermissions || [];
        this.description = options.description;
        this.examples = options.examples;
    }

    abstract run(message: Message, args: string[]): void;

    public getCommandName() {
        return this.name;
    }

    public getCommandAliases() {
        return this.aliases;
    }

    public getCommandExamples() {
        return this.examples;
    }

    public getDescription() {
        return this.description;
    }
}

interface ICommandOptions {
    name: string;
    description: string;
    aliases: string[];
    examples: string[];
    userPermissions: Array<PermissionResolvable>;
    botPermissions: Array<PermissionResolvable>;
    category: string;
}
