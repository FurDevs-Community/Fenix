import { Interaction, EmbedBuilder, Colors } from 'discord.js';
import FenixClient from '../lib/FenixClient';
import BaseInteraction from '../structures/BaseInteraction';
import BaseEvent from '../structures/BaseEvent';

export default class InteractionCreateEvent extends BaseEvent {
    constructor(client: FenixClient) {
        super(client, {
            eventName: 'interactionCreate',
        });
    }
    async run(client: FenixClient, interaction: Interaction) {
        if (interaction.isCommand() || interaction.isContextMenuCommand()) {
            if (!interaction.guild)
                interaction.reply({
                    content:
                        'Heya, I can only respond to Guild Commands! If you wish to contact staff please use the `/staff` command',
                });
            const cmd = client.interactions.get(interaction.commandName) as BaseInteraction;
            if (!cmd)
                return interaction
                    .followUp("This command doesn't exist anymore!")
                    .then(() =>
                        client.guilds.cache.get(client.config.testGuildID)?.commands.delete(interaction.commandName)
                    );
            if (cmd.userPermissions.length > 0) {
                cmd.userPermissions.forEach((perm) => {
                    const userPerms = interaction.guild?.members.cache.get(interaction.member!.user.id)?.permissions;
                    if (!userPerms?.has(perm))
                        return interaction.reply({
                            content: `:warning: You don't have permission to run this command! Permissions Needed: \`${cmd.userPermissions.join(
                                '``, `'
                            )}\``,
                            ephemeral: true,
                        });
                    return;
                });
            }

            if (cmd.botPermissions.length > 0) {
                cmd.botPermissions.forEach((perm) => {
                    const perms = interaction.guild?.me!.permissions;
                    if (!perms?.has(perm))
                        return interaction.reply({
                            content: `:warning: The bot don't have permission to run this command! Permissions Needed: \`${cmd.userPermissions.join(
                                '``, `'
                            )}\``,
                            ephemeral: true,
                        });
                    return;
                });
            }

            if (cmd.ownerOnly) {
                if (client.config.ownerID !== interaction.user.id)
                    return interaction.reply({
                        content: `:warning: This command can be only ran by the Owner of the Bot!`,
                        ephemeral: true,
                    });
            }
            try {
                await cmd.run(interaction);
            } catch (e: unknown) {
                console.error(e instanceof Error ? `${e.message}\n${e.stack}` : (e as string));
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL(),
                    })
                    .setColor(Colors.Red)
                    .setDescription(`${e}`)
                    .setFooter({
                        text: `If this isn't a fixable problem on your side please dm ${
                            client.users.cache.get(client.config.ownerID)!.tag
                        }`,
                        iconURL: interaction.user.displayAvatarURL(),
                    });
                return interaction.reply({ embeds: [embed] });
            }
        }
    }
}
