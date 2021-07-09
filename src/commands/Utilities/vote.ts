import HozolClient from '../../lib/HozolClient';
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import { channelResolver, checkTextChannel } from './../../helper/index';
import ms from 'ms';
import { primaryColor } from './../../settings';
import { addSchedule } from '../../helper/schedules/schedules';
import { Schedules } from '../../database';

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: 'vote',
            category: 'Utilites',
            runIn: ['text'],
            aliases: [],
            cooldown: 0,
            description: `Make a Vote for your Guild and have the bot automatically react with the reactions. (Coming Soon) with a live count down timer, and when the vote time ends it'll provide stats on the vote with charts`,
            enabled: true,
            ignoredInhibitors: [],
            userPerms: ['MANAGE_MESSAGES'],
            botPerms: ['EMBED_LINKS'],
        });
    }
    /**
     * @param message
     * @param args
     * @param client
     */
    async run(message: Message, args: string[], client: HozolClient) {
        if (!message.guild) return;
        let voteMsg;
        let duration;
        let channel;
        channel = await channelResolver(client, args[0]);
        if (channel && typeof channel !== 'undefined') {
            if (ms(args[1])) {
                duration = args[1];
                voteMsg = args.slice(2);
            } else {
                voteMsg = args.slice(1);
            }
        } else {
            if (ms(args[0])) {
                duration = ms(args[0]);
                voteMsg = args.slice(1);
            } else {
                voteMsg = args.slice(0);
            }
        }
        if (!channel) channel = message.channel;
        if (!checkTextChannel(channel)) return;
        const embed = new MessageEmbed()
            .setTitle(`Vote!`)
            .setDescription(voteMsg.join(' '))
            .setColor(primaryColor)
            .setFooter(
                `${
                    duration
                        ? `Ends at ${client
                              .moment(client.moment().add(duration, 'ms'))
                              .format('LLLL')}`
                        : 'This vote will never last.'
                }`
            );

        const msg = await channel.send(embed);
        await msg.react('✅');
        await msg.react('❌');
        console.log('here');
        await Schedules.create({
            uid: `vote-${msg.id}`,
            task: 'voteEnd',
            data: {
                user: message.author.id,
                guild: message.guild.id,
                channel: message.channel.id,
                messageID: msg.id,
            },
            nextRun: client.moment().add(duration, 'ms').toISOString(true),
        }).then(async (data) => {
            await addSchedule(client, data);
            console.log(data);
        });
    }
};
