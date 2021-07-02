import { MessageEmbed } from 'discord.js';
import { Message } from 'discord.js';
import { IssueDiscipline } from './../moderation/incidents';

export async function askRules(message: Message, discipline: IssueDiscipline) {
    if (!message.guild) return;
    const guildSettings = await message.guild.settings();
    // Ask for the rule numbers violate
    const msg = await message.channel.send(
        `:question: **Rule Numbers Violated**: Please state which rule number(s) pertain to this discipline. Separate multiple rule numbers with a space (eg. "1 5 12 19").\nPlease note: This is **${
            guildSettings.rulesSpecify
        }** therefore ${
            guildSettings.rulesSpecify === 'required'
                ? 'You may not say none'
                : 'You can provide no reason or the default reason by saying "none" to skip'
        }`
    );

    const rulesSpecified = await msg.channel.awaitMessages(
        (m) => m.author == message.author,
        {
            max: 1,
            time: 1000 * 60 * 10,
            errors: ['time'],
        }
    );
    if (rulesSpecified) {
        const rules = rulesSpecified.first()?.content.split(' ');
        if (rules![0].toLowerCase() === 'none') {
            await msg.delete();
            if (guildSettings.reasonSpecify === 'required') {
                let incorrect = true;
                while (incorrect) {
                    const msg = await message.channel.send(
                        `:question: **Rule Numbers Violated**: Please state which rule number(s) pertain to this discipline. Separate multiple rule numbers with a space (eg. "1 5 12 19").\nPlease note: This is **${
                            guildSettings.rulesSpecify
                        }** therefore ${
                            guildSettings.rulesSpecify === 'required'
                                ? 'You may not say none'
                                : 'You can provide no reason or the default reason by saying "none" to skip'
                        }`
                    );

                    const rulesSpecified = await msg.channel.awaitMessages(
                        (m) => m.author == message.author,
                        {
                            max: 1,
                            time: 1000 * 60 * 10,
                            errors: ['time'],
                        }
                    );
                    const rules = rulesSpecified.first()?.content.split(' ');
                    if (rules && rules![0].toLowerCase() !== 'none') {
                        incorrect = false;
                        rules.forEach(
                            async (rule) => await discipline.addRules(rule)
                        );
                        return;
                    }
                }
            }
            return;
        } else if (rules && rules.length > 0) {
            rules.map(async (rule) => {
                if (parseInt(rule)) {
                    await discipline.addRules(rule);
                }
            });
            msg.delete();
        } else {
            return;
        }
    }
}

export async function askReason(message: Message, discipline: IssueDiscipline) {
    // Ask for the rule numbers violated
    if (!message.guild) return;

    const guildSettings = await message.guild?.settings();
    const msg = await message.channel.send(
        `:question: **Reason**: Please provide a reason for this ban.\nPlease note: This is **${
            guildSettings.reasonSpecify
        }** therefore ${
            guildSettings.reasonSpecify === 'required'
                ? 'You may not say none'
                : 'You can provide no reason or the default reason by saying "none" to skip'
        }`
    );
    const reasonProvided = await msg.channel.awaitMessages(
        (m) => m.author == message.author,
        {
            max: 1,
            time: 1000 * 60 * 10,
            errors: ['time'],
        }
    );
    const reason = reasonProvided.first()?.content;
    if (reason === 'none') {
        await msg.delete();
        if (guildSettings.reasonSpecify === 'required') {
            let incorrect = true;
            while (incorrect) {
                const msg = await message.channel.send(
                    `:question: **Reason**: Please provide a reason for this ban.\nPlease note: This is **${
                        guildSettings.reasonSpecify
                    }** therefore ${
                        guildSettings.reasonSpecify === 'required'
                            ? 'You may not say none'
                            : 'You can provide no reason or the default reason by saying "none" to skip'
                    }`
                );
                const reasonProvided = await msg.channel.awaitMessages(
                    (m) => m.author == message.author,
                    {
                        max: 1,
                        time: 1000 * 60 * 10,
                        errors: ['time'],
                    }
                );
                const reason = reasonProvided.first()?.content;
                if (reason && reason !== 'none') {
                    incorrect = false;
                    await discipline.setReason(reason);
                    return;
                }
            }
        }
        return;
    } else if (reason) {
        await discipline.setReason(reason);
        await msg.delete();
    } else {
        return;
    }
}

export async function askQuestion(
    message: Message,
    question: string | MessageEmbed
) {
    const msg = await message.channel.send(question);
    const response = await msg.channel
        .awaitMessages((m) => m.author == message.author, {
            max: 1,
            time: 1000 * 60 * 10,
            errors: ['time'],
        })
        .catch(() => {
            throw new Error(
                'No response in 10 minutes was provided, cancelling'
            );
            msg.delete();
        });

    const answer = response.first();
    return [msg, answer];
}
