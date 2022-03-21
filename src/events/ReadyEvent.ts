import { ActivityType, ApplicationCommandPermissionType, GuildApplicationCommandPermissionData } from "discord.js";
import FenixClient from "../lib/FenixClient";
import BaseEvent from "../structures/BaseEvent";
import { Guild } from "../models/GuildModel";

export default class ReadyEvent extends BaseEvent {
    constructor(client: FenixClient) {
        super(client, {
            eventName: "ready"
        });
    }

    async run(client: FenixClient) {
        const guild = client.guilds.cache.get(client.config.testGuildID);
        if (!guild) {
            console.error("Cannot find the guild!");
            process.exit();
        }

        client.user?.setActivity({
            name: "Moderation Tunes",
            type: ActivityType.Listening
        });
        console.info("Loading (/) Permission and Setting up");

        console.info("Looking at Guild Data");
        let guildData;
        guildData = await Guild.findOne({ guildID: guild.id });
        if (!guildData) {
            console.log(`No Guild Data found for ${guild.id}... Creating one`);
            guildData = await Guild.create({ guildID: guild.id });
        }

        const fullPerms: GuildApplicationCommandPermissionData[] = [];
        await guild!.commands.set(client.interactionArray).then(async (cmd) => {
            // console.log(`Adding ${cmd} to the Guild Slash Commands`)
            console.info("Setting (/) Permissions");
            const getRoles = (cmdName: string) => {
                const permsRequired = client.interactionArray.find(
                    (x) => x.name === cmdName
                )!.userPermissions;
                if (permsRequired.length === 0) return;
                return guild?.roles.cache.filter(
                    (x) => x.permissions.has(permsRequired) && !x.managed
                );
            };

            const checkOwner = (cmdName: string) => {
                return client.interactionArray.find((x) => x.name === cmdName)!
                    .ownerOnly;
            };

            cmd.forEach((command) => {
                if (checkOwner(command.name)) {
                    fullPerms.push({
                        id: command.id,
                        permissions: [
                            {
                                id: client.config.ownerID,
                                permission: true,
                                type: ApplicationCommandPermissionType.User
                            }
                        ]
                    });
                }

                const roles = getRoles(command.name);
                if (!roles) return;
                roles.forEach((role) => {
                    const temp: GuildApplicationCommandPermissionData = {
                        id: command.id,
                        permissions: [
                            {
                                id: role.id,
                                permission: true,
                                type: ApplicationCommandPermissionType.Role
                            }
                        ]
                    };
                    fullPerms.push(temp);
                });
            });
            guild?.commands.permissions.set({ fullPermissions: fullPerms });
        });

        client.users.cache.get(client.config.ownerID)?.send("READY");
        client.user?.setStatus("online");
        console.info("Completed");
    }
}
