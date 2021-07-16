/* eslint-disable array-callback-return */
import HozolClient from '../../lib/HozolClient';
import { Command } from 'nukejs';
import { Message, MessageEmbed } from 'discord.js';
import { primaryColor } from '../../settings';
import { MessageActionRow, MessageButton, MessageComponent } from 'discord-buttons';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'help',
            category: 'Information',
            runIn: ['text'],
            aliases: ['helpme', 'h'],
            description: 'Show all the commands of Hozol!',
            enabled: true,
        });
    }

    /**
     * @param {Message} message
     * @param {string[]} args
     * @param {HozolClient} client
     */
    async run(message: Message, args: string[], client: HozolClient) {
        if (!message.guild) return;
        const settings = await message.guild.settings();
        const prefix = settings?.prefix || 'J>';
        message.delete().catch(() => {});
        const homeMenu = async (btn: MessageComponent | null) => {
            const [infoButton, managementButton, modButton, supportButton, closeButton] = generateButtons('menu');
            const rowOne = new MessageActionRow().addComponents(infoButton, managementButton);
            const rowTwo = new MessageActionRow().addComponents(modButton, supportButton, closeButton);
            const initEmbed = new MessageEmbed()
                .setTitle('Hozols Help Menu')
                .setColor(primaryColor)
                .setDescription(
                    `To seek more information to a specific command. Run \`${settings.prefix}help [Command]\``
                );
            if (!btn) {
                return await message.channel.send({
                    embed: initEmbed,
                    components: [rowOne, rowTwo],
                });
            } else {
                await btn.message.edit('', {
                    embed: initEmbed,
                    components: [rowOne, rowTwo],
                });
            }
        };
        await homeMenu(null);

        client.on('clickButton', async (btn) => {
            const [homeButton, closeButton] = generateButtons('cmd');
            switch (btn.id) {
                case 'infoHelp':
                    const infoEmbed = new MessageEmbed()
                        .setTitle(`Hozols Help Menu - Information`)
                        .setColor(primaryColor)
                        .setFooter(`User ID: ${message.author.id}`)
                        .setDescription(
                            `To seek more information to a specific command. Run \`${prefix}help [Command]\``
                        );
                    client.loader.Commands.map((cmd) => {
                        if (cmd.category === 'Information') {
                            infoEmbed.addField(`${prefix}${cmd.name}`, cmd.description);
                        }
                    });
                    await btn.message.edit('', { embed: infoEmbed, buttons: [homeButton, closeButton] });
                    await btn.reply.defer(true);
                    break;
                case 'homeHelp':
                    await homeMenu(btn);
                    await btn.reply.defer(true);
                    break;
                case 'closeHelp':
                    await btn.reply.defer(true);
                    await btn.message.delete();
                    break;
                case 'mgmtHelp':
                    const mgmtHelp = new MessageEmbed()
                        .setTitle(`Hozols Help Menu - Management`)
                        .setColor(primaryColor)
                        .setFooter(`User ID: ${message.author.id}`)
                        .setDescription(
                            `To seek more information to a specific command. Run \`${prefix}help [Command]\``
                        );
                    client.loader.Commands.map((cmd) => {
                        if (cmd.category === 'Management') {
                            mgmtHelp.addField(`${prefix}${cmd.name}`, cmd.description);
                        }
                    });
                    await btn.message.edit('', { embed: mgmtHelp, buttons: [homeButton, closeButton] });
                    await btn.reply.defer(true);
                    break;
                case 'modHelp':
                    const modHelp = new MessageEmbed()
                        .setTitle(`Hozols Help Menu - Moderation`)
                        .setColor(primaryColor)
                        .setFooter(`User ID: ${message.author.id}`)
                        .setDescription(
                            `To seek more information to a specific command. Run \`${prefix}help [Command]\``
                        );
                    client.loader.Commands.map((cmd) => {
                        if (cmd.category === 'Moderation') {
                            modHelp.addField(`${prefix}${cmd.name}`, cmd.description);
                        }
                    });
                    await btn.message.edit('', { embed: modHelp, buttons: [homeButton, closeButton] });
                    await btn.reply.defer(true);
                    break;
                case 'supportHelp':
                    const supportHelp = new MessageEmbed()
                        .setTitle(`Hozols Help Menu - Support`)
                        .setColor(primaryColor)
                        .setFooter(`User ID: ${message.author.id}`)
                        .setDescription(
                            `To seek more information to a specific command. Run \`${prefix}help [Command]\``
                        );
                    client.loader.Commands.map((cmd) => {
                        if (cmd.category === 'Support') {
                            supportHelp.addField(`${prefix}${cmd.name}`, cmd.description);
                        }
                    });
                    await btn.message.edit('', { embed: supportHelp, buttons: [homeButton, closeButton] });
                    await btn.reply.defer(true);
                    break;
            }
        });
    }
};

const generateButtons = (type: 'menu' | 'cmd' = 'menu') => {
    if (type === 'cmd') {
        const homeButton = new MessageButton()
            .setEmoji('◀')
            .setID('homeHelp')
            .setLabel('Return to Menu')
            .setStyle('blurple');
        const closeButton = new MessageButton().setEmoji('❌').setID('closeHelp').setLabel('Exit').setStyle('red');
        return [homeButton, closeButton];
    } else {
        const infoButton = new MessageButton()
            .setEmoji('ℹ️')
            .setID('infoHelp')
            .setLabel('Information Commands')
            .setStyle('blurple');
        const managementButton = new MessageButton()
            .setEmoji('⚙')
            .setID('mgmtHelp')
            .setLabel('Management Commands')
            .setStyle('blurple');
        const modButton = new MessageButton()
            .setEmoji('🔨')
            .setID('modHelp')
            .setLabel('Moderation Commands')
            .setStyle('blurple');
        const supportButton = new MessageButton()
            .setEmoji('💁')
            .setID('supportHelp')
            .setLabel('Support Commands')
            .setStyle('blurple');
        const closeButton = new MessageButton().setEmoji('❌').setID('closeHelp').setLabel('Exit').setStyle('red');
        return [infoButton, managementButton, modButton, supportButton, closeButton];
    }
};
