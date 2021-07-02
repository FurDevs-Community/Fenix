import HozolClient from './../../lib/HozolClient';
import { GuildEmoji, Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import { primaryColor } from '../../settings';
import _ from 'lodash';
import { DiscordMenu } from '../../helper';

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: 'emojis',
            category: 'Infomration',
            runIn: ['text'],
            aliases: [],
            cooldown: 0,
            description: `Get a list of emojis that are in the server`,
            enabled: true,
            ignoredInhibitors: [],
            userPerms: ['MANAGE_EMOJIS'],
        });
    }
    /**
     * @param message
     * @param args
     * @param client
     */
    async run(message: Message, args: string[], client: HozolClient) {
        await message.delete();
        if (!message.guild) return;
        const emojis: string[] = [];
        message.guild.emojis.cache.forEach((emoji: GuildEmoji) => {
            emojis.push(`${emoji.name} -  ${emoji} `);
        });
        const children: any = [];
        let _children: any = [];
        const children2: any = [];
        const childrenMain: any = [];
        emojis.forEach((option: string) => {
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
            message.channel,
            message.author.id,
            children2.map((group: any) => {
                const groupEmbed = new MessageEmbed()
                    .setAuthor(
                        `${message.author.tag}`,
                        `${message.author.displayAvatarURL({
                            dynamic: true,
                        })}`
                    )
                    .setTitle('Emojis in this server!')
                    .setDescription(group.join('\n'))
                    .setColor(primaryColor)
                    .setFooter(`User ID: ${message.author.id}`)
                    .setTimestamp();
                return groupEmbed;
            })
        );
    }
}
