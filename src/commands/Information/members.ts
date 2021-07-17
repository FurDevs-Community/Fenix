import HozolClient from '../../lib/HozolClient';
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import { Command } from 'nukejs';
import { DiscordMenu, roleNameResolver } from '../../helper';
import _ from 'lodash';
import { primaryColor } from '../../settings';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'members',
            category: 'Information',
            runIn: ['text'],
            aliases: [],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],
            description: 'Get every member with the specified role.',
            enabled: true,
            usage: '[ role ]',
        });
    }

    /**
     * @param {Message} message
     * @param {string[]} args
     * @param {HozolClient} client
     */
    async run(message: Message, args: string[], client: HozolClient) {
        await message.delete();
        if (!args[0]) {
            throw Error('Please specify a role');
        }
        const roleToSearch = await roleNameResolver(message, args.join(' '));
        const membersWithRole = [];
        const members = await message.guild?.members.fetch();
        if (!members) {
            throw Error('Error retrieving the members list');
        }
        for (const member of members.values()) {
            for (const role of member.roles.cache) {
                if (role[0] == roleToSearch.id) {
                    membersWithRole.push(`${member.user.username}#${member.user.discriminator}`);
                    break;
                }
            }
        }
        if (!membersWithRole.length) {
            throw Error(`No Member found with the role \`${roleToSearch.name}\``);
        }

        // Stolen from roleNameResolvers.ts
        // I am not gonna mess with the children shit -FiireWiinter
        const children: any = [];
        let _children: any = [];
        const children2: any = [];
        const childrenMain: any = [];
        membersWithRole.forEach((option: string) => {
            children.push(option);
            childrenMain.push(option);
        });

        // Now, break the users up into groups of 30 for pagination.
        while (children.length > 0) {
            _children.push(children.shift());
            if (_children.length > 29) {
                children2.push(_.cloneDeep(_children));
                _children = [];
            }
        }
        if (_children.length > 0) {
            children2.push(_.cloneDeep(_children));
        }

        new DiscordMenu(
            message.channel as TextChannel,
            message.author.id,
            children2.map((group: any) => {
                const groupEmbed = new MessageEmbed()
                    .setAuthor(
                        `${message.author.tag}`,
                        `${message.author.displayAvatarURL({
                            dynamic: true,
                        })}`
                    )
                    .setTitle('Members found!')
                    .setDescription('```yml\n- ' + group.join('\n- ') + '\n```')
                    .setColor(primaryColor)
                    .setFooter(`User ID: ${message.author.id}`)
                    .setTimestamp();
                return groupEmbed;
            })
        );
    }
};
