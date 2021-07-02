/* eslint-disable require-jsdoc */
import { Event } from 'nukejs';
import { checkActions, send } from '../helper';
import { Message, VoiceState } from 'discord.js';

module.exports = class extends Event {
    constructor() {
        super({
            name: 'voiceStateUpdate',
            enabled: true,
        });
    }

    async run(oldState: VoiceState, newState: VoiceState) {
        // Fetch partials
        if (newState.member?.partial) await newState.member?.fetch();

        // Check if the member should be kicked from the voice channel
        if (
            newState.member &&
            newState.channel?.id &&
            (oldState.member?.partial ||
                oldState.channel?.id !== newState.channel.id)
        ) {
            // Check if the member is muted. If so, kick them out of the voice channel.
            // TODO: Use muted helper when developed
            const memberSettings = await newState.member.settings();
            if (memberSettings.muted) {
                newState.kick('User is muted');
            }

            // Check if the member has a restriction on voice channel use. If so, kick them.
            const memberModeration = (await newState.member.moderation) as any;
            if (
                await checkActions(
                    memberModeration,
                    'Cannot use voice channels'
                )
            ) {
                newState.kick('Use is not allowed to use voice channels');

                // Add some spam score to prevent the potential of someone spamming the general channel by means of quickly and repeatedly trying to join a voice channel.
                // TODO
                // await sails.helpers.spam.add(newState.member, 25);

                const msg: Message = (await send(
                    'generalChannel',
                    newState.member.guild,
                    `:lock: Sorry <@${newState.member.id}>. But you are not allowed to use the voice channels. Warning: Repeatedly trying to access the voice channels will trigger the antispam system.`,
                    {}
                )) as Message;
                setTimeout(() => {
                    msg.delete();
                }, 15000);
            }
        }
    }
};
