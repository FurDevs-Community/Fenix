import HozolClient from '../../lib/HozolClient';
import { Channel, Message, MessageEmbed, TextChannel } from 'discord.js';
import { Command } from 'nukejs';
import { checkTextChannel } from '../../helper';
import { primaryColor } from '../../settings';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'archive',
            category: 'Moderation',
            runIn: ['text'],
            aliases: [],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_CHANNELS'],
            userPerms: ['MANAGE_CHANNELS'],
            description: 'Archive a channel',
            enabled: true,
            extendedHelp: 'Archive a channel.',
            usage: '',
        });
    }

    /**
     * @param {Message} message
     * @param {string[]} args
     * @param {HozolClient} client
     */
    async run(message: Message, args: string[], client: HozolClient) {
        await message.delete();
        // Clone the channel first
        const currentChannel: Channel = message.channel;
        if (!checkTextChannel(currentChannel)) return;
        const newChannel: TextChannel = await currentChannel.clone({
            reason:
                'Channel archive - Responsible Person : ' +
                message.author.username,
        });
        await newChannel.setPosition(currentChannel.position);
        // Remove all permissions; set deny on everyone
        await currentChannel.overwritePermissions(
            [
                {
                    id: currentChannel.guild.roles.everyone,
                    deny: ['VIEW_CHANNEL'],
                },
            ],
            'Channel archive'
        );

        // Edit the channel name
        await currentChannel.edit({
            name: `${currentChannel.name}-archived`,
        });

        // Send a cloned channel message
        const clonedEmbed = new MessageEmbed()
            .setTitle(':exclamation: Archive - Original channel was cloned')
            .setDescription(
                'This is a cloned channel; the original channel by the same name has been archived.'
            )
            .setColor(primaryColor)
            .setTimestamp();
        await newChannel.send(clonedEmbed);

        // Send a notice in the channel archived
        const archivedEmbed = new MessageEmbed()
            .setAuthor(
                `${message.author.tag}`,
                `${message.author.displayAvatarURL({ dynamic: true })}`
            )
            .setTitle(':exclamation: Archive - This channel is Archived')
            .setDescription(
                `This channel has been archived; all permissions were removed and everyone has "deny" for read messages.
        
:warning: If this channel was a part of bot configuration, be sure to update it with the new channel!`
            )
            .setColor(primaryColor)
            .setTimestamp()
            .setFooter(
                `Requester ID: ${message.author.id} | New Channel ID: ${newChannel.id}`
            );
        return currentChannel.send(archivedEmbed);
    }
}
