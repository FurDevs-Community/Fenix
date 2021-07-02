import HozolClient from '../../lib/HozolClient';
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import translate from '@vitalets/google-translate-api';
import { primaryColor } from '../../settings';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'translate',
            category: 'Information',
            runIn: ['text'],
            aliases: [''],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
            description: 'Translate some text to and from any language',
            enabled: true,
            extendedHelp: 'Translate some text to and from any language.',
            usage: '[ (Translation Language) | Text to translate]',
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
            throw Error('Please specify a text to translate');
        }
        const toTranslate = args.slice(1).join(' ');
        let translated;
        let text;
        try {
            text = toTranslate;
            translated = await translate(text, {
                to: args[0].toLowerCase(),
            });
        } catch (error) {
            text = args.join(' ');
            translated = await translate(text, { to: 'en' });
        }

        const embed = new MessageEmbed()
            .setAuthor(
                `${message.author.username}`,
                `${message.author.displayAvatarURL({ dynamic: true })}`
            )
            .setTitle('Translation')
            .addField(
                `From: ${translated.from.language.iso}`,
                translated.from.text.value || text
            )
            .addField(`To: ${translated.raw[1][1]}`, translated.text)
            .setColor(primaryColor)
            .setTimestamp()
            .setFooter(`User ID: ${message.author.id}`);
        await message.channel.send(embed);
    }
}
