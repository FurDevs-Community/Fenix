import HozolClient from '../../lib/HozolClient';
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import { chronoTimeResolver, uid } from '../../helper';
import ms from 'ms';
import { Schedules } from '../../database';
import { addSchedule } from '../../helper/schedules/schedules';
import { primaryColor } from '../../settings';

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: 'remind',
            category: 'Utilites',
            runIn: ['text'],
            aliases: ['remindme'],
            cooldown: 50000,
            description: `Make the bot remind you to do something`,
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
        await message.delete();
        if (!args[0]) throw new Error('Please provide the time you would like to be reminded');
        let duration;
        let reminder: string;
        if (args[0].toLowerCase() === 'smart') {
            if (!args[1]) throw new Error('Please provide what you want to reminded');
            reminder = args.slice(1).join(' ');
            const date = await chronoTimeResolver(client, args.slice(1).join(' ')).catch(() => {
                throw new Error('unable to get the data from your reminder');
            });
            duration = ms(date.toString());
        } else {
            duration = ms(args[0]);
            if (!args[1]) throw new Error('Please provide what you want to reminded');
            reminder = args.slice(0).join(' ');
        }
        const id = await uid();
        await Schedules.create({
            uid: `reminder-${id}`,
            task: 'reminder',
            data: {
                user: message.author.id,
                guild: message.guild.id,
                reminder: reminder,
            },
            nextRun: client.moment().add(duration, 'ms').toISOString(true),
        }).then(async (data) => {
            const embed = new MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTitle('Reminder Set')
                .setDescription(
                    `You'll be reminded on ${client.moment(data.nextRun).utc().format('LLLL')} UTC to ${reminder}`
                )
                .setColor(primaryColor)
                .setTimestamp()
                .setFooter(`User ID: ${message.author.id}`);
            message.channel.send(embed);
            await addSchedule(client, data);
            console.log(data);
        });
    }
};
