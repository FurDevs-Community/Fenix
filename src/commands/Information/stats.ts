import HozolClient from '../../lib/HozolClient';
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import { primaryColor } from '../../settings';

const pjson = require('./../../../package.json');

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'stats',
            category: 'Information',
            runIn: ['text'],
            aliases: ['statistics', 'stonks'],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
            description: "Get the bot's Stats",
            enabled: true,
            extendedHelp:
                "Get the bot's Stats which includes the bot's uptime, Version, Guilds, Discord Version.",
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
        const embed = new MessageEmbed()
            .setAuthor(
                `${message.author.username}`,
                `${message.author.displayAvatarURL({ dynamic: true })}`
            )
            .setTitle('📊 Hozols Stats!');
        const botCreator = await client.users.fetch('679145795714416661');
        const msg = await message.channel.send('Getting the Stats...');
        if (client.uptime) {
            let totalSeconds = client.uptime / 1000;
            const days = Math.floor(totalSeconds / 86400);
            totalSeconds %= 86400;
            const hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = Math.floor(totalSeconds % 60);
            embed.addField(
                "I've been Online For",
                `${days} Days, ${hours} Hours, ${minutes} Minutes, and ${seconds} Seconds`
            );
        }
        let guildsCount;
        if (client.shard) {
            client.shard
                .fetchClientValues('guilds.cache.size')
                .then((guildArr) => {
                    guildsCount = guildArr.reduce(
                        (total, next) => total + next
                    );
                });
        } else {
            guildsCount = client.guilds.cache.size;
        }
        embed
            .addField("I'm currently in", `${guildsCount} Guilds!`, true)
            .addField('The API Latency', `${Math.round(client.ws.ping)}ms`)
            .addField('My Bot Version', `${pjson.version}`, true)
            .addField(
                'Discord Version',
                `${pjson.dependencies['discord.js'].slice(1)}`,
                true
            )
            .addField('Bot Owner', `${botCreator.tag}`)
            .addField('NukeJS Version:', pjson.dependencies.nukejs)
            .setColor(primaryColor)
            .setTimestamp()
            .setFooter(`User ID: ${message.author.id}`);
        await msg.edit(embed);
    }
};
