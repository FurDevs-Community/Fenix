// Imports
import HozolClient from '../../lib/HozolClient';
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import { primaryColor } from '../../settings';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'reload',
            category: 'Developers',
            runIn: ['text'],
            aliases: ['reboot', 'restart'],
            restricted: 'dev',
            description: "Kill the bot's processes!",
            enabled: true,
        });
    }

    /**
     * @param {Message} message
     * @param {string[]} args
     * @param {HozolClient} client
     */
    async run(message: Message, args: string[], client: HozolClient) {
        // Deletes the sent message
        await message.delete();

        // Sends an embed showing the it's updating the bot
        const embed = new MessageEmbed()
            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
            .setTitle('⚠️ Reloading the Bot.')
            .setColor(primaryColor)
            .setDescription('⏲️ This may take a bit.')
            .setTimestamp()
            .setFooter(`User ID: ${message.author.id}`);
        message.channel.send(embed).then(async (msg) => {
            try {
                // Executes this command then reload the commands
                await process.exit();
                embed.setTitle('The bot has been reloaded.');
                embed.setDescription("The bot's commands has been reloaded!");
                await msg.edit(embed);
            } catch (err) {
                // ERROR!? Throw it
                throw new Error(err);
            }
        });
    }
};
