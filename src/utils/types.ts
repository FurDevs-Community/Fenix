import {
    ApplicationCommandOptionChoice,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    CommandOptionDataTypeResolvable,
    PermissionFlags,
} from "discord.js";

export interface ICommandOptions {
    args?: ICommandArgsOptions[];
    cooldown?: number;
    extendedDescription?: string;
    group?: string;
    name: string;
    ownerOnly?: boolean;
    type: ApplicationCommandType;
    runIn?: "both" | "dms" | "servers";
    shortDescription?: string;
    usage?: string;
    userPermissions: Array<keyof PermissionFlags>;
    botPermissions: Array<keyof PermissionFlags>;
}

export interface ICommandArgsOptions {
    choices?: ApplicationCommandOptionChoice[];
    description: string;
    name: string;
    options?: ICommandArgsOptions[];
    required?: boolean;
    type: CommandOptionDataTypeResolvable;
}
export interface ISelectMenuData {
    uid: string;
    name: string;
    roles: {
        name: string;
        value: string;
    }[];
}
