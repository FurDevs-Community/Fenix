import { execSync } from 'child_process';
import { ColorResolvable, ChatInputCommandInteraction, EmbedBuilder, ApplicationCommandType } from 'discord.js';
import FenixClient from '../../lib/FenixClient';
import BaseSlashCommand from '../../structures/BaseInteraction';

export default class UpdateCommand extends BaseSlashCommand {
    constructor(client: FenixClient) {
        super(client, {
            name: 'update',
            shortDescription: 'Update the Bot!',
            args: [],
            type: ApplicationCommandType.ChatInput,
            cooldown: 0,
            userPermissions: [],
            botPermissions: [],
            ownerOnly: true,
        });
    }
    async run(interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder()
            .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setTitle('📥  Update - Updating bot...')
            .setColor(0xaa00ae)
            .setDescription('⏲️ This may take a bit...')
            .setTimestamp()

            .setFooter({
                text: `User ID: ${interaction.user.id}`,
                iconURL: interaction.user.displayAvatarURL(),
            });
        await interaction.reply({ embeds: [embed] });
        try {
            const gitStash = execSync('git stash').toString();
            const gitPull = execSync('git pull origin master').toString();
            if (gitStash && gitPull)
                embed.addFields({ name: '🗳️ GIT', value: `\`\`\`Git Stash: ${gitStash}\nGit Pull: ${gitPull}\`\`\`` });
            const yarn = execSync('yarn install').toString();
            if (yarn) embed.addFields({ name: '🧶 Yarn', value: `\`\`\`${yarn}\`\`\`` });
            embed.setTitle('☑️ Update Complete');
            embed.setDescription('');
            interaction.editReply({ embeds: [embed] });
        } catch (e) {
            throw new Error(`${e}`);
        }
    }
}
