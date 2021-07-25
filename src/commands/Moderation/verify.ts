import { Client } from 'nukejs';
import { Message } from 'discord.js';
import { Command } from 'nukejs';
import { checkPermissions } from '../../helper/permissions/checkPermissions';
import { usernameResolver } from '../../helper';

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: 'verify',
            category: 'Moderation',
            runIn: ['text'],
            aliases: ['approve'],
            cooldown: 0,
            description: `Verify yourself by solving a puzzle, captcha, etc OR Manually give the user the verify role if they complete verification (the commands functionailty will be different depending on the guilds settings)`,
            enabled: true,
            ignoredInhibitors: [],
        });
    }
    /**
     * @param message
     * @param args
     * @param client
     */
    // TODO: Make it so the user would solve a puzzle, get liked to a captcha or verify via email As of right now the command is used to give users the verified role
    async run(message: Message, args: string[], client: Client) {
        if (!message.guild) return;
        const settings = await message.guild.settings();
        const role = settings.verifiedRole;
        if (!role) throw new Error('There is no verification role... please set that up!');
        switch (settings.verificationMethod) {
            case 'manual':
                checkPermissions(message, ['MANAGE_ROLES']);
                if (!args) {
                    throw new Error(
                        'Please Provide a user you would like to verify it can be a username, mention, or ID'
                    );
                } else {
                    const user = await usernameResolver(message, args.slice(0).join(' '));
                    const member = message.guild.members.cache.get(user.id);
                    if (!member) throw new Error('The member is not in the Guild!');
                    if (member.roles.cache.has(role)) throw new Error('The user is already verified!');
                    const botPosition = message.guild?.me?.roles.highest.position;
                    const userPosition = member.roles.highest.position;
                    const rolePosition = message.guild.roles.cache.get(role)!.position;
                    if (botPosition! <= userPosition) {
                        throw new Error(
                            `The bot's highest role (${message.guild?.me?.roles.highest}) must be above the user's highest role (${member.roles.highest}) in order to verify that user`
                        );
                    }
                    if (botPosition! <= rolePosition) {
                        throw new Error(
                            `The bot's highest role (${message.guild?.me?.roles.highest}) must be above the verified role in order to verify users`
                        );
                    }

                    try {
                        const msg = await message.channel.send('Approving User...');
                        member.roles.add(role).then(() => {
                            msg.delete();
                            if (
                                message.guild?.channels.cache.get(settings.generalChannel) &&
                                settings.welcomeMessage &&
                                settings.sendWelcomeMessage
                            ) {
                                let welcomeMsg = settings.welcomeMessage;
                                welcomeMsg = welcomeMsg.replace('%username%', `<@${member.id}>`);
                                welcomeMsg = welcomeMsg.replace('%guild%', `${message.guild.name}`);
                                message.guild?.channels.cache
                                    ?.get(settings.generalChannel)
                                    // @ts-ignore
                                    ?.send(welcomeMsg);
                            }
                        });
                    } catch (e) {
                        throw new Error(`There was a problem verifing this user\n\n${e}`);
                    }
                }
                break;
            default:
                message.channel.send('Other Methods are not added atm please use the Manual Verification Method');
        }
    }
};
