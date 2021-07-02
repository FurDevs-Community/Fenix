import { Client } from 'nukejs';
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import { usernameResolver } from '../../helper';
import { Members } from '../../database';
import { primaryColor } from '../../settings';

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: 'note',
            category: 'Moderation',
            runIn: ['text'],
            aliases: ['addNote'],
            cooldown: 0,
            description: `Add a note to a user\'s account`,
            enabled: true,
            ignoredInhibitors: [],
            userPerms: ['VIEW_AUDIT_LOG'],
        });
    }
    /**
     * @param message
     * @param args
     * @param client
     */
    async run(message: Message, args: string[], client: Client) {
        if (!args[0])
            throw new Error('You must provide a user you wanna note about');
        const user = await usernameResolver(message, args[0]);
        if (!args[1])
            throw new Error(
                'You must provide something to note about on that user'
            );
        const note = args.slice(1).join(' ');
        const member = message.guild?.members.cache.get(user.id);
        if (!member) throw new Error('Unable to get the member');
        const memberSettings = await member.settings();
        try {
            await Members.updateOne(
                { userID: user.id },
                { notes: [...memberSettings.notes, note] }
            );
        } catch (e) {
            throw new Error(e);
        }

        const embed = new MessageEmbed()
            .setAuthor(
                message.author.tag,
                message.author.displayAvatarURL({ dynamic: true })
            )
            .setTitle(`Noted`)
            .setDescription(`${member} has received a note on their account`)
            .setColor(primaryColor)
            .setTimestamp()
            .setFooter(`User ID: ${user.id}`);
        message.channel.send(embed);
    }
}
