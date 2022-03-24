import BaseInteraction from "../../structures/BaseInteraction";
import FenixClient from "../../lib/FenixClient";
import {
    ActionRowBuilder,
    APISelectMenuOption,
    ApplicationCommandOptionType,
    ApplicationCommandType, ButtonBuilder, ButtonStyle,
    ChatInputCommandInteraction,
    ComponentType,
    EmbedBuilder,
    EmbedFieldData,
    Message,
    SelectMenuBuilder,
    UnsafeSelectMenuOptionBuilder
} from 'discord.js';
import { Guild, IVerificationaInterface } from "../../models/GuildModel";

export default class ConfigCommand extends BaseInteraction {
    constructor(client: FenixClient) {
        super(client, {
            name: "config",
            shortDescription:
                "Category of settings you would like to configure",
            args: [
                {
                    name: "verification",
                    description: "What to configure and to what",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "option",
                            description: "Option of what you want to change within the verification.",
                            required: true,
                            type: ApplicationCommandOptionType.String,
                            choices: [
                                {
                                    name: "View",
                                    value: "view"
                                },
                                {
                                    name: "Verification Logs",
                                    value: "verificationLoggingChannelID"
                                },
                                {
                                    name: "Verification Questions",
                                    value: "verificationQuestions"
                                },
                                {
                                    name: "List of Unverified Roles",
                                    value: "unverifiedRolesID"
                                },
                                {
                                    name: "List of Verified Roles",
                                    value: "verifiedRolesID"
                                },
                                {
                                    name: "Welcome Role",
                                    value: "welcomeRoleID"
                                },
                                {
                                    name: "Channel to send Welcome Message",
                                    value: "welcomeChannelID"
                                },
                                {
                                    name: "Welcome Message",
                                    value: "verificationWelcomeMsg"
                                },
                                {
                                    name: "Verification Message Instructions",
                                    value: "verificationInstruction"
                                },
                                {
                                    name: "Pending Verification Channel",
                                    value: "pendingVerificationChannelID"
                                }
                            ]
                        }
                    ]
                }
            ],
            botPermissions: [],
            cooldown: 0,
            extendedDescription: "Configure the bot settings",
            group: "",
            ownerOnly: false,
            runIn: "servers",
            type: ApplicationCommandType.ChatInput,
            usage: "",
            userPermissions: ["ManageGuild"]
        });
    }

    async run(interaction: ChatInputCommandInteraction) {
        let option;
        let embed;
        let data;
        const fields: EmbedFieldData[] = [];
        switch (interaction.options.getSubcommand()) {
            case "verification":
                option = interaction.options.getString("option", true);
                switch (option) {
                    case "view":
                        data = await Guild.findOne({ guildID: interaction.guild!.id })!;
                        if (!data) throw new Error("There was an error getting the guild data");
                        for (const key in (data.verification as IVerificationaInterface)) {
                            fields.push({
                                name: key,
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-expect-error
                                value: data.verification[key] ? data.verification[key] : "Not set"
                            });
                        }
                        embed = new EmbedBuilder()
                            .setAuthor({
                                name: interaction.user.tag,
                                iconURL: interaction.user.displayAvatarURL()
                            })
                            .setColor(0x8800FF)
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            .addFields(...fields);
                        interaction.reply({
                            embeds: [embed]
                        });
                        break;
                    case "verificationLoggingChannelID":
                    case "welcomeChannelID":
                    case "pendingVerificationChannelID":
                        const channels: (APISelectMenuOption | UnsafeSelectMenuOptionBuilder)[] = [];
                        interaction.guild!.channels.cache.filter(channel => channel.isText()).forEach(channel => {
                            channels.push({
                                label: channel.name,
                                value: channel.idx
                            });
                        });
                        const channelSelectMenu = new ActionRowBuilder().addComponents(new SelectMenuBuilder().setCustomId("channel_select_menu").setMinValues(1).setMaxValues(1).setOptions(...channels));
                        const awaitChannelID = new EmbedBuilder()
                            .setTitle("Configuration - Setting Channel")
                            .setDescription("Select which channel you would like the messages to go related to that settings with the dropdown")
                            .setColor(0x8800FF)
                            .setFooter({
                                text: `User ID: ${interaction.user.id}`,
                                iconURL: interaction.user.displayAvatarURL()!
                            });
                        // @ts-ignore
                        interaction.reply({ embeds: [awaitChannelID], components: [channelSelectMenu] });
                        const msg = await interaction.fetchReply() as Message;
                        const channel = await msg.awaitMessageComponent({
                            componentType: ComponentType.SelectMenu,
                            filter: m => m.user.id === interaction.user.id,
                            time: 10 * 60000
                        });
                        if(!channel) throw new Error("There was a problem setting the channel");
                        await Guild.updateOne({ guildID: interaction.guild!.id }, { [interaction.options.getString("options") as any]: channel.values[0] });
                        const guildChannel = interaction.guild!.channels.cache.get(channel.values[0] as string)
                        const successfulMsg = new EmbedBuilder().setTitle("Updated Channel").setColor(0x8800FF).setDescription(`Channel has been set to ${guildChannel!.name} (${guildChannel!.id})`));
                        return interaction.editReply({ embeds: [successfulMsg], components: [] })
                    case "unverifiedRolesID":
                    case "verifiedRolesID":
                        const rolesListEmbed = new EmbedBuilder()
                            .setTitle("List of roles")
                            .setDescription("Add/Remove the list of roles");
                        const actions = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("update").setLabel("Add").setStyle(ButtonStyle.Primary), new ButtonBuilder().setStyle(ButtonStyle.Danger).setLabel("Remove").setCustomId("remove"))
                        break;
                    case "welcomeRoleID":
                        // TODO: wait for member's response with role
                        break;
                    case "verificationWelcomeMsg":
                    case "verificationInstruction":
                        // TODO Wait for user's response with text 10 mins
                        break;
                }
        }
    }
}
