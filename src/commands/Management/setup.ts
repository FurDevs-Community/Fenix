import { Client } from 'nukejs';
import { Message, MessageEmbed, MessageReaction, User } from 'discord.js';
import { Command } from 'nukejs';
import { primaryColor } from '../../settings';
import { Setup } from '../../helper/guild/setup';

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: 'setup',
            category: 'Management',
            runIn: ['text'],
            aliases: ['wizard'],
            cooldown: 10,
            description: `Setup the Bot for your guild quickly and easily with this wizard`,
            enabled: true,
            ignoredInhibitors: [],
            userPerms: ['MANAGE_GUILD'],
            botPerms: ['MANAGE_CHANNELS', 'MANAGE_ROLES', 'SEND_MESSAGES', 'MANAGE_MESSAGES'],
        });
    }
    /**
     * @param message
     * @param args
     * @param client
     */
    async run(message: Message, args: string[], client: Client) {
        if (!message.guild) return;
        await message.delete();
        let string: string;
        const embed = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTitle('Hozol Setup Wizard')
            .setDescription(
                `Welcome to Hozol's Setup Wizard! We'll go ahead and ask you a couple of question on how Hozol™️ should behave in your guild.

                 We'll firstly start with loggings. This process should take at least 5 minutes. We'll also go through how you would like Hozol to log activity, handling antispam, moderation and guild settings.

                 At any time you feel like you made a mistake, you can always say cancel to discard all your responses and cancel the setup process. If you are ready, react with the checkmark below. Otherwise react to X to cancel the process..`
            )
            .setColor(primaryColor)
            .setTimestamp()
            .setFooter(`User ID: ${message.author.id}`);
        const msg = await message.channel.send(embed);
        await msg.react('✅');
        await msg.react('❌');
        const allowedEmojis = ['✅', '❌'];
        const filter = (r: MessageReaction, u: User) =>
            message.author.id === u.id && allowedEmojis.includes(r.emoji.name);
        const m = msg.createReactionCollector(filter, { time: 60000 * 5 });
        m.on('collect', async (response) => {
            switch (response.emoji.name) {
                case '✅':
                    const setup = new Setup(msg, embed, string);
                    await setup.initalize();
                    break;
                case '❌':
                    msg.delete();
                    msg.channel.send(`Cancelled`).then((m) => {
                        m.delete({ timeout: 5000 });
                    });
                    break;
            }
        });
    }
};
