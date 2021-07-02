import { Client } from 'nukejs';
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import { Moderations } from '../../database';
import { primaryColor } from '../../settings';

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: 'case',
            category: 'Moderation',
            runIn: ['text'],
            aliases: ['viewCase', 'caseLookup'],
            cooldown: 0,
            description: `View a case Information`,
            enabled: true,
            ignoredInhibitors: [],
            userPerms: ['MANAGE_MESSAGES'],
        });
    }
    /**
     * @param message
     * @param args
     * @param client
     */
    async run(message: Message, args: string[], client: Client) {
        if (!args[0])
            throw new Error(
                'Provide a case you would like to see information on'
            );
        const caseInfo = await Moderations.findOne({ cases: args[0] });
        if (!caseInfo)
            throw new Error(
                "No cases were found. Please check if there's a typo"
            );
        const embed = new MessageEmbed()
            .setTitle(`Case ${caseInfo.cases} - ${caseInfo.type}`)
            .setAuthor(
                message.author.tag,
                message.author.displayAvatarURL({ dynamic: true })
            )
            .addField(
                `Issuer`,
                `${client.users.cache.get(caseInfo.issuer)?.username} (${
                    caseInfo.issuer
                })`
            )
            .addField(
                `User`,
                `${client.users.cache.get(caseInfo.userID)?.username} (${
                    caseInfo.userID
                })`
            )
            .addField(`Rules Violated`, caseInfo.rules.join(' '))
            .setColor(primaryColor)
            .addField(`Reason`, caseInfo.reason)
            .setFooter(`User ID: ${message.author.id}`);
        message.channel.send(embed);
    }
}
