import HozolClient from '../../lib/HozolClient';
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import { Guilds as Guild } from '../../database/Schemas/Guild';

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: 'disablecommand',
            category: 'Management',
            runIn: ['text'],
            aliases: ['disablecmd'],
            cooldown: 0,
            description: `Disable a command so it'll no longer be used.`,
            enabled: true,
            userPerms: ['MANAGE_GUILD'],
            ignoredInhibitors: [],
        });
    }
    /**
     * @param message
     * @param args
     * @param client
     */
    async run(message: Message, args: string[], client: HozolClient) {
        if (!message.guild) return;
        if (!args[0])
            throw new Error(
                'Please provide a command or alias of what command you would like to disable'
            );
        const settings = await message.guild.settings();
        const cmd =
            client.commands.get(args[0]) ||
            client.commands.find((tempCmd) =>
                tempCmd.aliases.includes(args[0])
            );
        if (!cmd || typeof cmd === undefined) {
            throw new Error("This command doesn't exist in the bot");
        }
        if (cmd.name === 'enablecmd' || cmd.name === 'disableCMD')
            throw new Error('You cannot disable these commands');
        const newDisabledCommands = [...settings.disabledCommands, cmd.name];
        try {
            await Guild.findOneAndUpdate(
                { guildID: message.guild.id },
                { disabledCommands: newDisabledCommands }
            );
        } catch (e) {
            client.error(
                `An error occured trying to update the disable commands!\n\n${e}`
            );
        }
        const embed = new MessageEmbed()
            .setTitle(`:x: Command: ${cmd.name} been disabled for this guild`)
            .setAuthor(
                message.author.tag,
                message.author.displayAvatarURL({ dynamic: true })
            )
            .setColor(`RED`)
            .setDescription(
                `The Command: ${cmd.name} ${
                    cmd.aliases.length > 0
                        ? `(Alias: ${cmd.aliases.join(', ')})`
                        : ''
                } is now disabled`
            )
            .setTimestamp()
            .setFooter(`User ID: ${message.author.id}`);
        await message.channel.send(embed);
    }
}
