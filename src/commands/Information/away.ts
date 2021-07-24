import HozolClient from '../../lib/HozolClient';
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import { Members as Member } from '../../database/Schemas/Member';
import { primaryColor } from '../../settings';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        /**
         * @param {any} file
         */
        super(file, {
            name: 'away',
            category: 'Information',
            runIn: ['text'],
            aliases: ['afk'],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
            description: 'Set your away Status',
            enabled: true,
            usage: '[ away message ]',
        });
    }

    /**
     * @param {Message} message
     * @param {string[]} args
     * @param {HozolClient} client
     */
    async run(message: Message, args: string[], client: HozolClient) {
        if (!args[0]) {
            throw Error('Please specify a away message');
        }
        const awayMessage = args.join(' ');
        const guildData = await message.guild?.settings();
        if (!guildData?.awaySystem) return;
        try {
            await Member.findOneAndUpdate(
                { guildID: message.guild?.id, userID: message.author.id },
                { awayStatus: awayMessage }
            );
        } catch (e) {
            client.error(`An error occured trying to update a away message!\n\n${e}`);
            throw Error('An error occured setting your away Status.');
        }
        const embed = new MessageEmbed()
            .setAuthor(
                `${message.author.tag}`,
                `${message.author.displayAvatarURL({
                    dynamic: true,
                })}`
            )
            .setTitle('Away message set!')
            .setDescription(
                `I have set your away message to this:\n\`\`\`\n${awayMessage}\n\`\`\`\nDon't be long. I'll be waiting for you <3`
            )
            .setColor(primaryColor)
            .setFooter(`User ID: ${message.author.id}`)
            .setTimestamp();
        message.channel.send(embed);
    }
};
