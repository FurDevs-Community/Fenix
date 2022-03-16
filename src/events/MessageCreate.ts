import { ColorResolvable, Interaction, Message, EmbedBuilder } from 'discord.js';
import FenixClient from '../lib/FenixClient';
import BaseInteraction from '../structures/BaseInteraction';
import BaseEvent from '../structures/BaseEvent';

export default class InteractionCreateEvent extends BaseEvent {
    constructor(client: FenixClient) {
        super(client, {
            eventName: 'messageCreate',
        });
    }
    async run(client: FenixClient, message: Message) {
        const mentionRegex = RegExp(`^<@!${client.user!.id}>$`);
        const mentionRegexPrefix = RegExp(`^<@!${client.user!.id}> `);

        let prefix = message.content.match(mentionRegexPrefix)
            ? message.content.match!(mentionRegexPrefix)![0]
            : client.config.prefix;
        if (message.content.match(mentionRegex))
            message.channel.send(`Hey ${message.author}! My Prefix is \`${client.config.prefix}\``);
        if (message.content.startsWith(prefix)) {
            let commandParts = message.content.slice(prefix.length).trim().split(/ +/g);
            const command = commandParts.shift()!.toLowerCase();
            const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command)!);
            if (!cmd) return;
            // @ts-expect-error
            cmd.run(message, commandParts).catch((e: Error) => {
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: message.author.tag,
                        iconURL: message.author.displayAvatarURL(),
                    })
                    .setTitle('Error!')
                    .setColor(0xaa00ae)
                    .setThumbnail(message.author.displayAvatarURL())
                    .setDescription(e.message)
                    .setFooter({
                        text: `If the error seems to be a bot error that is not a user mistake, please contact ${
                            client.users.cache.get('852070153804972043')?.username
                        }`,
                        iconURL: message.author.displayAvatarURL(),
                    });
                message.channel.send({ embeds: [embed] });
            });
        }
    }
}
