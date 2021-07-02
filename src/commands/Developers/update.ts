import HozolClient from '../../lib/HozolClient';
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import { execute } from '../../helper';
import { primaryColor } from '../../settings';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'update',
            category: 'Developers',
            runIn: ['text'],
            aliases: ['upgrade', 'sudo-apt-update'],
            restricted: 'dev',
            description: 'Update the bot to the latest version!',
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
            .setAuthor(
                `${message.author.tag}`,
                `${message.author.displayAvatarURL({ dynamic: true })}`
            )
            .setTitle('📥  Update - Updating bot...')
            .setColor(primaryColor)
            .setDescription('⏲️ This may take a bit...')
            .setTimestamp()
            .setFooter(`User ID: ${message.author.id}`);

        // Makes what is sent a message variable
        const msg = await message.channel.send(embed);

        // Execute the update script
        const result: any = await execute('sh update.sh');

        // Send the result
        if (result[0]) {
            const output = result[0];
            const error = new MessageEmbed()
                .setAuthor(
                    `${message.author.tag}`,
                    `${message.author.displayAvatarURL({ dynamic: true })}`
                )
                .setColor(primaryColor)
                .setTitle("ERROR! - Bot didn't update!")
                .setDescription(
                    `Please pray the lords and hope that the update didn't mess up the prod files.(Please ssh into the server and resolve the errors) \n \`\`\`${output}\`\`\``
                )
                .setTimestamp()
                .setFooter(`User ID: ${message.author.id}`);
            return message.channel.send(error);
        } else {
            const output = result.slice(1);
            const complete = new MessageEmbed()
                .setAuthor(
                    `${message.author.tag}`,
                    `${message.author.displayAvatarURL({ dynamic: true })}`
                )
                .setColor(primaryColor)
                .setTitle('Update - Bot was updated!')
                .setDescription(
                    `You may now use the reload command to reload the bot with the New Features. \n \`\`\`${output}\`\`\``
                )
                .setTimestamp()
                .setFooter(`User ID: ${message.author.id}`);
            await msg.edit(complete);
        }
    }
}
