import { Client } from 'nukejs';
import { Message } from 'discord.js';
import { Command } from 'nukejs';
import { MessageEmbed } from 'discord.js';
import { roleNameResolver } from '../../helper';
import moment from 'moment';

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: 'roleinfo',
            category: 'Information',
            runIn: ['text'],
            aliases: ['ri'],
            cooldown: 0,
            description: `Get information on a role`,
            enabled: true,
            ignoredInhibitors: [],
        });
    }
    /**
     * @param message
     * @param args
     * @param client
     */
    async run(message: Message, args: string[], client: Client) {
        if (!args[0])
            throw new Error(
                'Please provide an Role (Mention|Name|ID) that you want to see information about'
            );
        const allowedPerms: any[] = [];
        const disallowedPerms: any[] = [];
        const role = await roleNameResolver(message, args[0]);
        const embed = new MessageEmbed()
            .setAuthor(
                message.author.tag,
                message.author.displayAvatarURL({ dynamic: true })
            )
            .setTitle(`Role Information for ${role.name}`)
            .setDescription('Below are information about the role')
            .addField('Name', role.name, true)
            .addField('Created at', moment(role.createdAt).format('LLLL'), true)
            .addField('Role ID', role.id, true)
            .setColor(role.hexColor)
            .setTimestamp()
            .setFooter('User ID: ' + message.author.id);
        const allPermissions: any[] = [
            'CREATE_INSTANT_INVITE',
            'KICK_MEMBERS',
            'BAN_MEMBERS',
            'ADMINISTRATOR',
            'MANAGE_CHANNELS',
            'MANAGE_GUILD',
            'ADD_REACTIONS',
            'VIEW_AUDIT_LOG',
            'PRIORITY_SPEAKER',
            'STREAM',
            'VIEW_CHANNEL',
            'SEND_MESSAGES',
            'SEND_TTS_MESSAGES',
            'MANAGE_MESSAGES',
            'EMBED_LINKS',
            'ATTACH_FILES',
            'READ_MESSAGE_HISTORY',
            'MENTION_EVERYONE',
            'USE_EXTERNAL_EMOJIS',
            'VIEW_GUILD_INSIGHTS',
            'CONNECT',
            'SPEAK',
            'MUTE_MEMBERS',
            'DEAFEN_MEMBERS',
            'MOVE_MEMBERS',
            'USE_VAD',
            'CHANGE_NICKNAME',
            'MANAGE_NICKNAMES',
            'MANAGE_ROLES',
            'MANAGE_WEBHOOKS',
            'MANAGE_EMOJIS',
        ];
        const perms = role.permissions.toArray();
        perms.forEach((perm) => {
            allowedPerms.push(
                allPermissions.splice(allPermissions.indexOf(perm), 1)
            );
        });
        disallowedPerms.push(...allPermissions);

        embed.addField(
            'Allowed Permissions',
            `${
                allowedPerms.length > 0
                    ? `✅ \`${allowedPerms.join('`, `')}\``
                    : 'No Allowed Permission'
            }`,
            true
        );
        embed.addField(
            'Disallowed Permissions',
            `${
                disallowedPerms.length > 0
                    ? `❌ \`${disallowedPerms.join('`, `')}\``
                    : 'No Disallowed Permission'
            }`,
            true
        );
        message.channel.send(embed);
    }
}
