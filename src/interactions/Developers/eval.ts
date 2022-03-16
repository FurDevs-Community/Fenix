import beautify from 'beautify';
import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ChatInputCommandInteraction,
    EmbedBuilder,
} from 'discord.js';
import FenixClient from '../../lib/FenixClient';
import BaseSlashCommand from '../../structures/BaseInteraction';

export default class EvalCommand extends BaseSlashCommand {
    constructor(client: FenixClient) {
        super(client, {
            name: 'eval',
            shortDescription: 'Evaluate some Node.js Code!',
            args: [
                {
                    name: 'code',
                    description: "NodeJS Code you'd want to evaluate",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
            cooldown: 0,
            userPermissions: [],
            type: ApplicationCommandType.ChatInput,
            botPermissions: [],
            ownerOnly: true,
        });
    }
    async run(interaction: ChatInputCommandInteraction) {
        const script = interaction.options.getString('code', true);
        if (script?.includes('token')) return interaction.reply('Request Denied!');
        try {
            const evaluated = eval(script);
            const evaled = require('util').inspect(evaluated, { depth: 5 });
            const promisedEval: any = await Promise.resolve(evaluated);
            let res;
            if (evaled.toString().length >= 1024) {
                res = 'Result too big, check the console';
            } else {
                res = evaled;
            }
            let promisedResult;
            if (promisedEval.toString().length >= 1024) {
                promisedResult = 'Result too big, check the console';
            } else {
                promisedResult = promisedEval;
            }

            // Process the output
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL(),
                })
                .setTitle('Evaluated Code')
                .setColor(0xaa00ae)
                .setTimestamp()
                .addFields(
                    {
                        name: ':inbox_tray: Input:',
                        value: `\`\`ts\n${beautify(script, { format: 'js' })} \`\`\``,
                    },
                    {
                        name: ':outbox_tray: Output',
                        value: `\`\`ts\n${res}\`\`\``,
                    }
                )
                .setFooter({
                    text: `User ID: ${interaction.user.id}`,
                    iconURL: interaction.user.displayAvatarURL(),
                })
                .setThumbnail(this.client!.user?.displayAvatarURL()!);

            if (evaluated && evaluated.then) {
                embed.addFields({ name: ':outbox_tray: Promise Output', value: `\`\`\`js\n${promisedResult}\`\`\`` });
            }

            // Add a type of what is the type of what's evaluated
            embed.addFields({ name: 'Type of: ', value: `\`\`\`${typeof evaluated}\`\`\`` });

            // Sends the embed
            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (err: any) {
            // If any errors occurred... then, send the error instead
            throw new Error(err);
        }
    }
}
