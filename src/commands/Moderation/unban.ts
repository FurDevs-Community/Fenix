import HozolClient from '../../lib/HozolClient';
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import { askQuestion } from '../../helper/moderation/askRules';
import { send, userResolver } from '../../helper';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'unban',
            category: 'Moderation',
            runIn: ['text'],
            aliases: [],
            botPerms: ['BAN_MEMBERS'],
            userPerms: ['BAN_MEMBERS'],
            description: 'Unban a Member',
            enabled: true,
            extendedHelp: 'Unban a member.',
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
        if (!args[0]) {
            throw new Error('Please provide a User ID of that banned member');
        }
        const user = await userResolver(client, args[0]);
        if (user === message.author) {
            throw new Error("You can't unban yourself!? But the real question is why :think:.");
        }
        let reason = args.slice(1).join(' ');
        const guildSettings = await message.guild?.settings();
        if (!reason && guildSettings?.reasonSpecify !== 'ignore') {
            let correct = false;
            while (!correct) {
                // eslint-disable-next-line no-unused-vars
                const [_, answer] = await askQuestion(
                    message,
                    `❓ Why are you wanting to unban this member?\nPlease note this is ${
                        guildSettings?.reasonSpecify
                            ? '**required** therefore you must provide a reason'
                            : '**optional** therefore you can put "none"'
                    }`
                );
                if (!answer) return;
                if (answer.content && answer.content.toLowerCase() !== 'none') {
                    correct = true;
                    reason = answer.content;
                }
            }
        }
        message.guild?.members
            .unban(user, reason)
            .then(async () => {
                const embed = new MessageEmbed()
                    .setTitle('Unban')
                    .setAuthor(`Issued By: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
                    .addField('Unbanned User', `${user}(${user.id})`)
                    .addField('Reason:', reason)
                    .setTimestamp()
                    .setFooter(`User ID: ${message.author.id}`)
                    .setColor('GREEN');
                message.channel.send(embed);
                const publicEmbed = new MessageEmbed()
                    .setAuthor(
                        `Issued by: ${message.author.tag}`,
                        `${message.author.displayAvatarURL({ dynamic: true })}`
                    )
                    .addField('User', user.tag)
                    .setTimestamp();
                await send('publicModLogChannel', message.guild!, '', {
                    embed: publicEmbed,
                });
            })
            .catch((err) => {
                throw new Error(
                    `I was unable to unban this member, the reason is provided below\n\n\`\`\`${err}\`\`\``
                );
            });
    }
};
