/* eslint-disable require-jsdoc */
/* eslint-disable no-redeclare */
/* eslint-disable no-var */
/* eslint-disable brace-style */
/* eslint-disable array-callback-return */
import HozolClient from '../../lib/HozolClient';
import { Guild, GuildMember, MessageEmbed, TextChannel, User } from 'discord.js';
import {
    IMember,
    IProfile,
    Members as Member,
    Moderations as Moderation,
    muteUser,
    Schedules,
    unMuteUser,
} from '../../database';
import { uid } from '../general/uid';
import { send } from '../guild/send';
import { addSchedule } from '../schedules/schedules';

export class IssueDiscipline {
    public client: HozolClient;
    public channel: TextChannel | null;
    public user: User;
    public guild: Guild;
    public issuer: User;
    public type:
        | 'note'
        | 'warning'
        | 'discipline'
        | 'antispam'
        | 'task'
        | 'restriction'
        | 'kick'
        | 'ban'
        | 'discord-ban'
        | 'investigation'
        | null;

    public rules: string[];
    public reason: string;
    public additionalInfo: string | null;
    public note: string | null;
    public xp: number;
    public coins: number;
    public vpts: number;
    public channelRestrictions: string[];
    public rolesAdded: string[];
    public rolesRemoved: string[];
    public cannotUseVoiceChannels: boolean;
    public cannotGiveReputation: boolean;
    public cannotUseReportCommand: boolean;
    public cannotUseSupportCommand: boolean;
    public cannotUseStaffCommand: boolean;
    public cannotUseConflictCommand: boolean;
    public cannotEditProfile: boolean;
    public banDuration: any;
    public muteDuration: any;
    public tasks: string[];
    public case: string | null;
    private guildSettings: any;
    private memberSettings: IMember;
    private guildMember: GuildMember | null;
    private memberProfile: IProfile;
    private readonly publicEmbed: MessageEmbed;
    private readonly userEmbed: MessageEmbed;

    constructor(user: User, guild: Guild, issuer: User) {
        this.client = <HozolClient>guild.client;
        this.channel = null;
        this.user = user;
        this.guild = guild;
        this.issuer = issuer;
        this.type = null;
        this.rules = [];
        this.reason = `No reason was provided. Please contact the staff for ${this.guild.name}.`;
        this.additionalInfo = null;
        this.note = null;
        this.xp = 0;
        this.coins = 0;
        this.vpts = 0;
        this.channelRestrictions = [];
        this.rolesAdded = [];
        this.rolesRemoved = [];
        this.cannotUseVoiceChannels = false;
        this.cannotGiveReputation = false;
        this.cannotUseReportCommand = false;
        this.cannotUseSupportCommand = false;
        this.cannotUseConflictCommand = false;
        this.cannotEditProfile = false;
        this.cannotUseStaffCommand = false;
        this.muteDuration = null;
        this.banDuration = null;
        this.tasks = [];
        this.case = null;
        this.guildSettings = null;
        this.publicEmbed = new MessageEmbed();
        this.userEmbed = new MessageEmbed();
    }

    async setType(
        type:
            | 'note'
            | 'warning'
            | 'discipline'
            | 'antispam'
            | 'task'
            | 'restriction'
            | 'kick'
            | 'ban'
            | 'discord-ban'
            | 'investigation'
            | null
    ) {
        this.type = type;
        return this;
    }

    async addRules(ruleNumber: string) {
        this.rules.push(ruleNumber);
        return this;
    }

    async setReason(reason: string) {
        this.reason = reason;
    }

    async setAdditionInfo(info: string) {
        this.additionalInfo = info;
        return this;
    }

    async deductXP(xp: number) {
        this.xp = xp;
    }

    async addFines(coins: number) {
        this.coins = coins;
        return this;
    }

    async addVPTS(vpts: number) {
        this.vpts = vpts;
        return this;
    }

    async addChannelRestrictions(channelID: string) {
        this.channelRestrictions.push(channelID);
        return this;
    }

    async addedRoles(roleID: string) {
        this.rolesAdded.push(roleID);
        return this;
    }

    async removedRoles(roleID: string) {
        this.rolesRemoved.push(roleID);
        return this;
    }

    async toggleCannotUseVoiceChannels() {
        this.cannotUseVoiceChannels = !this.cannotUseVoiceChannels;
        return this;
    }

    async toggleCannotGiveReputation() {
        this.cannotGiveReputation = !this.cannotGiveReputation;
        return this;
    }

    async toggleCannotUseReportCommand() {
        this.cannotUseReportCommand = !this.cannotUseReportCommand;
        return this;
    }

    async toggleCannotUseSupportCommand() {
        this.cannotUseSupportCommand = !this.cannotUseSupportCommand;
        return this;
    }

    async toggleCannotUseConflictCommand() {
        this.cannotUseConflictCommand = !this.cannotUseConflictCommand;
        return this;
    }

    async toggleCannotEditProfile() {
        this.cannotEditProfile = !this.cannotEditProfile;
        return this;
    }

    async toggleCannotUseStaffCommand() {
        this.cannotEditProfile = !this.cannotEditProfile;
        return this;
    }

    async setBanDuration(days: number) {
        this.banDuration = days;
        return this;
    }

    async setChannel(channel: TextChannel) {
        this.channel = channel;
        return this;
    }

    async setMuteDuration(hours: number) {
        this.muteDuration = hours;
        return this;
    }

    async addTasks(task: string) {
        this.tasks.push(task);
        return this;
    }

    async addNote(note: string) {
        this.note = note;
        return this;
    }

    public async initialize() {
        if (this.rules.length === 0) {
            this.rules.push('`Not Provided`');
        }
        await this.getSettings();
        await this.getOrCreateCase();
        await this.setBaseEmbed();
    }

    public async warnUser() {
        this.muteDuration = null;
        this.banDuration = null;
        this.type = 'warning';
        this.userEmbed.setTitle('⚠️**__YOU HAVE BEEN FORMALLY WARNED__** ⚠️');
        this.userEmbed
            .setDescription(
                `We are concerned about your recent conduct. Please read this information carefully. Future incidents can result in discipline${
                    this.channel
                        ? '. You may ask staff any questions you have, or to help you develop a plan to avoid these incidents in the future, in this channel.'
                        : '.'
                }` +
                    '\n\n' +
                    `:hash: You are in violation of rule number(s): ${this.rules.join(', ')}` +
                    '\n' +
                    `Reason: ${this.reason}`
            )
            .setFooter(
                `${
                    this.channel
                        ? '🔒 This channel is private between you and staff to discuss this matter. Please remain respectful'
                        : '❓ If you have any questions or concerns feel free to contact the staff members'
                }` +
                    '\n' +
                    '😊 Thank you for your understanding and cooperation.' +
                    '\n' +
                    `#️⃣ Case ID: ${this.case}`
            );
        this.publicEmbed.setDescription(`${this.user} has been warned!`).addField('Reason', this.reason);
    }

    public async disciplineUser() {
        this.muteDuration = 0;
        this.banDuration = 0;
        this.type = 'discipline';
        this.userEmbed
            .setTitle(':octagonal_sign: **__YOU HAVE BEEN DISCIPLINED__** :octagonal_sign:')
            .setDescription(
                'You have recently violated our rules and have been issued basic discipline. Please read the following information carefully. You may ask questions or request help to develop an a plan in this channel.' +
                    '\n\n' +
                    `:hash: You are in violation of rule number(s): ${this.rules.join(', ')}` +
                    '\n' +
                    `Reason: ${this.reason}`
            )
            .setFooter(
                `${
                    this.channel
                        ? '🔒 This channel is private between you and staff to discuss this matter. Please remain respectful'
                        : '❓ If you have any questions or concerns feel free to contact the staff members'
                }` +
                    '\n' +
                    '😊 Thank you for your understanding and cooperation.' +
                    '\n\n' +
                    `#️⃣ Case ID: ${this.case}`
            );
        await this.restrictions();
        this.publicEmbed.setDescription(
            `${this.user} was issued an basic discipline! They have lost either access to certain channels as well or what they earned (VPTS, Coins, Reps, XP) or both`
        );
    }

    public async antiSpam() {
        this.muteDuration = 0;
        this.banDuration = null;
        this.type = 'antispam';
        this.userEmbed
            .setTitle(':mute: **__YOU HAVE BEEN MUTED FOR SPAM__** :mute:')
            .setDescription(
                'You have been muted by the automatic antispam system. Please read the following information carefully.' +
                    '\n\n' +
                    `:hash: You are in violation of rule number(s): ${this.rules.join(', ')}` +
                    '\n' +
                    `Reason: ${this.reason}`
            )
            .setFooter(
                `${
                    this.channel
                        ? '🔒 This channel is private between you and staff to discuss this matter. Please remain respectful'
                        : '❓ If you have any questions or concerns feel free to contact the staff members'
                }` +
                    '\n' +
                    '😊 Thank you for your understanding and cooperation.' +
                    '\n\n' +
                    `#️⃣ Case ID: ${this.case}`
            );
        // TODO: Discipline Shit Goes Here
        // TODO: Refer to the Mute Discipline with a Parameter of "antispam"
    }

    public async task() {
        this.muteDuration = 0;
        this.banDuration = null;
        this.type = 'task';
        this.userEmbed
            .setTitle(':notebook: **__YOU ARE REQUIRED TO COMPLETE TASKS__** :notebook:')
            .setDescription(
                'You have recently violated our rules. We need you to complete one or more tasks to be allowed full access again in the guild. Please read the following information carefully. You may ask questions or request help in this channel.' +
                    '\n\n' +
                    `:hash: You are in violation of rule number(s): ${this.rules.join(', ')}` +
                    '\n' +
                    `Reason: ${this.reason}`
            )
            .setFooter(
                `${
                    this.channel
                        ? '🔒 This channel is private between you and staff to discuss this matter. Please remain respectful'
                        : '❓ If you have any questions or concerns feel free to contact the staff members'
                }` +
                    '\n' +
                    '😊 Thank you for your understanding and cooperation.' +
                    '\n\n' +
                    `#️⃣ Case ID: ${this.case}`
            );
        await this.classD();
        this.publicEmbed
            .setDescription(
                `${this.user} was assigned task(s), they must complete the task inorder to have access to the guild!`
            )
            .addField('Tasks', this.tasks.join('\n'));
    }

    public async kickUser() {
        this.type = 'kick';
        if (this.guildMember) {
            if (this.guildMember.kickable) {
                try {
                    this.guildMember.kick();
                } catch (e: any) {
                    throw new Error(e);
                }
            } else {
                throw new Error('I am unable to kick the user.');
            }
        } else {
            throw new Error('The user is not in the guild.');
        }
        this.publicEmbed
            .setDescription(`${this.user} has been kicked!`)
            .addField('Reason', this.reason)
            .addField('Ban Duration', this.banDuration);
    }

    public async banUser() {
        this.muteDuration = null;
        if (!this.banDuration) {
            this.userEmbed
                .setTitle(':no_entry_sign: **__YOU HAVE BEEN BANNED INDEFINITELY__** :no_entry_sign:')
                .setDescription(
                    `Your behavior cannot be tolerated in our guild. An indefinite ban has been issued against you. We hope you enjoyed your stay and wish you the best in your future endeavors. Please read the following information carefully${
                        this.channel ? '. You may ask questions in this channel.' : '.'
                    }` +
                        '\n\n' +
                        `:hash: You are in violation of rule number(s): ${this.rules.join(', ')}` +
                        '\n' +
                        `Reason: ${this.reason}`
                );
            this.publicEmbed
                .setDescription(`An Indefinite Ban has been place on ${this.user}`)
                .addField('Reason', this.reason);
        } else {
            this.userEmbed
                .setTitle(':no_entry: **__YOU HAVE BEEN BANNED TEMPORARILY__** :no_entry:')
                .setDescription(
                    `Your conduct has caused significant problems in the community.${
                        this.channel
                            ? 'You are required to leave for a temporary time to reflect on, and improve, your behavior.'
                            : ' '
                    }  Please read the following information carefully.${
                        this.channel ? '. You may ask questions in this channel.' : '.'
                    }` +
                        '\n\n' +
                        `:hash: You are in violation of rule number(s): ${this.rules.join(', ')}` +
                        '\n' +
                        `Reason: ${this.reason}`
                )
                .addField(
                    'Your Ban will be lifted on',
                    this.client.moment(Date.now()).add(this.banDuration, 'days').format('LLLL')
                )
                .setFooter(
                    `${
                        this.channel
                            ? '🔒 This channel is private between you and staff to discuss this matter. Please remain respectful'
                            : '❓ If you have any questions or concerns feel free to contact the staff members'
                    }` +
                        '\n' +
                        '😊 Thank you for your understanding and cooperation.' +
                        `${
                            this.guildSettings.appealFormLink
                                ? `🔗 To Appeal your ban please fill out an form: ${this.guildSettings.appealFormLink}\n`
                                : '\n'
                        }` +
                        `#️⃣ Case ID: ${this.case}`
                );
            this.publicEmbed
                .setDescription(
                    `An Temporary Ban has been place on ${this.user} and will be lifted in ${this.banDuration} days`
                )
                .addField('Reason', this.reason)
                .addField('Ban Duration', this.banDuration);
        }
    }

    public async investigation() {
        this.muteDuration = 0;
        this.banDuration = null;
        this.userEmbed
            .setTitle(':mag: **__YOU HAVE BEEN MUTED FOR FURTHER INVESTIGATION__** :mag:')
            .setDescription(
                "You have recently violated the law or Discord's Terms of Service. You have been muted while we file a report and an investigation is conducted. Please read the following information carefully." +
                    '\n\n' +
                    `:hash: You are in violation of rule number(s): ${this.rules.join(', ')}` +
                    '\n' +
                    `Reason: ${this.reason}`
            )
            .setFooter(
                `${
                    this.channel
                        ? '🔒 This channel is private between you and staff to discuss this matter. Please remain respectful.\n"👮 STAFF: while this member is under investigation, do NOT delete relevant messages. Furthermore, if you issue a ban, choose the "Don\'t Delete Any" option for delete message history. Discord requires that the original messages remain present until they finish investigating.\n'
                        : '\n'
                }` +
                    '\n' +
                    '😊 Thank you for your understanding and cooperation.' +
                    '\n' +
                    `#️⃣ Case ID: ${this.case}`
            );
    }

    public async muteUser() {
        if (!this.muteDuration) {
            this.muteDuration = 0;
            this.banDuration = null;
            this.userEmbed
                .setTitle('🔇 **__YOU HAVE BEEN MUTED INDEFINITELY__** 🔇')
                .setDescription(
                    `Your behavior cannot be tolerated in our guild. An indefinite mute has been issued against you and can be lifted by staff. Please read the following information carefully${
                        this.channel ? '. You may ask questions in this channel.' : '.'
                    }` +
                        '\n\n' +
                        `:hash: You are in violation of rule number(s): ${this.rules.join(', ')}` +
                        '\n' +
                        `Reason: ${this.reason}`
                );
            this.publicEmbed
                .setDescription(`An Indefinite Mute has been place on ${this.user}`)
                .addField('Reason', this.reason);
        } else {
            this.banDuration = null;
            this.userEmbed
                .setTitle('🔇 **__YOU HAVE BEEN MUTED TEMPORARILY__** 🔇')
                .setDescription(
                    `Your conduct has caused significant problems in the community. Please read the following information carefully.${
                        this.channel ? '. You may ask questions in this channel.' : '.'
                    }` +
                        '\n\n' +
                        `:hash: You are in violation of rule number(s): ${this.rules.join(', ')}` +
                        '\n' +
                        `Reason: ${this.reason}`
                );
        }
        this.userEmbed.setFooter(
            `${
                this.channel
                    ? '🔒 This channel is private between you and staff to discuss this matter. Please remain respectful'
                    : '❓ If you have any questions or concerns feel free to contact the staff members'
            }` +
                '\n' +
                '😊 Thank you for your understanding and cooperation.' +
                `${
                    this.guildSettings.appealFormLink
                        ? `🔗 To Appeal your ban please fill out an form: ${this.guildSettings.appealFormLink}\n`
                        : '\n'
                }` +
                `#️⃣ Case ID: ${this.case}`
        );
    }

    public async finish() {
        await this.restrictions();
        // TODO: Raid Score should get called here
        await Moderation.create({
            cases: this.case,
            guildID: this.guild.id,
            userID: this.user.id,
            issuer: this.issuer.id,
            appealed: false,
            type: this.type,
            rules: this.rules,
            reason: this.reason,
        });

        if (this.banDuration !== null && !this.channel) {
            await this.banEmbed();
            await this.sendUserEmbed().catch(() => this.client.error('Unable to send that user'));
            // If the ban is permanent
            if (this.banDuration === 0) {
                this.guild.members.ban(this.user, {
                    days: 0,
                    reason: this.reason,
                });
            }
            // If there's a duration specified other than zero temporarily ban that user
            else {
                await this.banEmbed();
                await this.sendUserEmbed();
                this.guild.members.ban(this.user, {
                    days: 0,
                    reason: this.reason,
                });

                // Add a schedule if the ban is limited duration
                if (this.banDuration > 0) {
                    await Schedules.create({
                        uid: `d-${this.case}`,
                        task: 'removeBan',
                        data: {
                            user: this.user.id,
                            guild: this.guild.id,
                        },
                        nextRun: this.client.moment().add(this.banDuration, 'days').toISOString(true),
                    }).then(async (data) => {
                        await addSchedule(this.client, data);
                    });
                    await Member.updateOne(
                        {
                            guildID: this.guild.id,
                            userID: this.user.id,
                        },
                        {
                            schedule: `d-${this.case}`,
                        }
                    );
                }
            }
        } else if (this.muteDuration !== null) {
            // If the mute is permanent
            const muteRole = await this.guildSettings.muteRole;
            if (this.muteDuration === 0) {
                if (this.guildMember) {
                    await this.sendUserEmbed();
                    this.guildMember.roles
                        .add(muteRole, `Muted was issued on this user by ${this.issuer.tag}`)
                        .then(async () => {
                            await muteUser(this.guild.id, this.user.id);
                        });
                }
            }
            // If there's a duration specified other than zero temporarily mute that user
            else {
                if (this.guildMember) {
                    await this.sendUserEmbed();
                    this.guildMember.roles
                        .add(
                            muteRole,
                            `Muted was issued on this user by ${this.issuer.tag}. The mute will be cleared in ${this.muteDuration} minutes`
                        )
                        .then(async () => {
                            await muteUser(this.guild.id, this.user.id);
                        });
                }
                this.mute();
            }
        } else if (this.banDuration !== null && this.channel) {
            this.mute();
            // If the member is no longer in the guild, issue the ban or tempban immediately, and undo the mute
            if (!GuildMember) {
                if (this.banDuration !== null && this.type !== 'discord-ban') {
                    // Apply the ban
                    await this.guild.members.ban(this.user, {
                        days: this.type === 'investigation' ? 0 : 7,
                        reason: this.reason,
                    });
                    if (!this.tasks || this.banDuration === 0) {
                        await unMuteUser(this.guild.id, this.user.id);
                    }
                }
            }
        } else {
            if (this.type !== 'kick') {
                await this.sendUserEmbed();
            }
        }

        await this.postEmbeds();

        return this;
    }

    private async getSettings() {
        this.guildSettings = await this.guild.settings();
        this.guildMember = this.guild.members.cache.get(this.user.id) || null;
        this.memberSettings = await this.user.guildSettings(this.guild.id);
        this.memberProfile = await this.user.guildProfile(this.guild.id);
    }

    private async getOrCreateCase() {
        if (this.channel) {
            this.case = this.channel.name.split('-')[1];
        } else {
            this.case = await uid();
        }
    }

    private async setBaseEmbed() {
        this.publicEmbed
            .setAuthor(`Issued by: ${this.issuer.tag}`, `${this.issuer.displayAvatarURL({ dynamic: true })}`)
            .addField('User', this.user.tag)
            .setTimestamp();
        this.userEmbed
            .setAuthor(`Issued by: ${this.issuer.tag}`, `${this.issuer.displayAvatarURL({ dynamic: true })}`)
            .addField('🧍‍♂️ User', this.user.tag)
            .addField('🏠 Guild', this.guild.name)
            .setColor(colour(this.type))
            .setTimestamp();
    }

    private async classD() {
        if (this.tasks.length > 0) {
            if (this.banDuration === null) {
                this.muteDuration = 0;
                this.userEmbed.addField(
                    ':clipboard: **You are required to complete tasks**',
                    'This discipline includes one or more required tasks for you to complete. Please note the following:' +
                        '\n' +
                        '---You are muted in the guild until all tasks have been completed / satisfied.' +
                        '\n' +
                        '---You may be kicked or even Banned from the guild if you go several days without completing your tasks, at staff discretion.'
                );
            } else {
                // If ban duration is specified
                this.userEmbed.addField(
                    ':clipboard: **You are required to complete tasks when you return to the guild**',
                    'This discipline includes one or more required tasks for you to complete once you return to the guild from your temporary ban. Please note the following:' +
                        '\n' +
                        '---You are muted in the guild. Once you return after your temporary ban, you will remain muted until all tasks are completed / satisfied.' +
                        '\n' +
                        '---You may be kicked ot banned from the guild if you go several days without completing your tasks, at staff discretion.'
                );
            }

            if (this.tasks) {
                this.userEmbed
                    .addField(
                        ':pencil: **You must complete on or more tasks**',
                        this.tasks.map((record) => `◾${record}`).join('\n')
                    )
                    .addField(
                        'Task requirement',
                        "---The task must be completed and proof showing that you've completed the task assigned." +
                            '\n' +
                            `---Please post completed task ${
                                this.channel
                                    ? 'in this channel.'
                                    : 'to the staff member that has issue the discipline against you'
                            }.`
                    );
            }
        }
    }

    private async banEmbed() {
        // Bans, If the Ban Duration is specified
        if (this.banDuration !== null) {
            // if the ban equals zero
            if (this.banDuration === 0) {
                this.userEmbed.addField(
                    ':no_entry_sign: **You have been indefinitely banned**',
                    `${
                        this.channel
                            ? 'You are asked to leave the guild immediately. We hope you enjoyed your stay and wish you luck in your journey.\nOnce you leave the guild, a ban will be placed on you. This ban will remain in place indefinitely or until staff manually remove it. Until you leave or staff kick you, you will remain muted.'
                            : 'We hope you enjoyed your stay and wish you luck in your journey.'
                    }`
                );
            } else {
                this.userEmbed.addField(
                    `:no_entry: **You have been temporarily banned for ${this.banDuration} days**`,
                    `${
                        this.channel
                            ? `You are required to leave the guild and reflect on, and improve, your behavior.\nOnce you leave the guild, a ban will be placed on you, which will be removed by the bot in ${this.banDuration} days. Your temp-ban time will not begin until you leave the guild or get kicked; until then, you will remain muted.`
                            : `Your ban will be removed by the bot in ${this.banDuration} days`
                    }`
                );
            }
        }
    }

    private async mute() {
        if (this.muteDuration !== null && this.muteDuration > 0 && (!this.banDuration || !this.guildMember)) {
            await Schedules.create({
                uid: `d-${this.case}`,
                task: 'removeMute',
                data: {
                    user: this.user.id,
                    guild: this.guild.id,
                },
                nextRun: this.client.moment().add(this.muteDuration, 'minutes').toISOString(true),
            }).then(async (data) => {
                await addSchedule(this.client, data);
            });

            await Moderation.updateOne({ uid: this.case }, { schedule: `d-${uid}` });
        }
    }

    private async restrictions() {
        // Channel restrictions
        if (this.channelRestrictions && this.channelRestrictions.length > 0) {
            const channelNames: any[] = [];
            this.channelRestrictions.map((channel) => {
                const theChannel = this.guild.channels.resolve(channel);

                if (theChannel) {
                    channelNames.push(`${theChannel.parent ? `${theChannel.parent.name} -> ` : ''}${theChannel.name}`);
                    theChannel.createOverwrite(
                        this.user,
                        {
                            VIEW_CHANNEL: false,
                        },
                        `Discipline case ${uid}`
                    );
                }
            });
            this.userEmbed.addField(
                ':lock_with_ink_pen: **You can no longer access these channels**',
                `\`\`\`${channelNames.join('\n')}\`\`\``
            );
        }
        // Roles
        if (this.rolesAdded && this.rolesAdded.length > 0) {
            var roleNames: any[] = [];
            var maps = this.rolesAdded.map(async (permission, index) => {
                const theRole = this.guild.roles.resolve(permission);

                if (theRole) {
                    roleNames.push(theRole.name);
                    if (this.guildMember) {
                        this.guildMember.roles.add(theRole, `Discipline case ${uid}`);
                    } else {
                        const roles = this.memberSettings.roles;
                        roles.push(theRole.id);
                        await Member.updateOne(
                            {
                                guildID: this.guild.id,
                                userID: this.user.id,
                            },
                            {
                                roles: roles,
                            }
                        );
                    }
                }
            });
            await Promise.all(maps);

            this.userEmbed.addField(
                ':closed_lock_with_key: **Roles were added**',
                `These roles have been added to you: ${roleNames.join(', ')}`
            );
        }

        if (this.rolesRemoved && this.rolesRemoved.length > 0) {
            var roleNames = [];
            var maps = this.rolesRemoved.map(async (permission, index) => {
                const theRole = this.guild.roles.resolve(permission);

                if (theRole) {
                    roleNames.push(theRole.name);
                    if (this.guildMember) {
                        this.guildMember.roles.remove(theRole, `Discipline case ${uid}`);
                    } else {
                        // TODO: Get
                        const roles = this.memberSettings.roles.filter((role: any) => role.id !== theRole?.id);
                        await Member.updateOne(
                            {
                                guildID: this.guild.id,
                                userID: this.user.id,
                            },
                            {
                                roles: roles,
                            }
                        );
                    }
                }
            });
            await Promise.all(maps);

            this.userEmbed.addField(
                ':closed_lock_with_key: **Roles were removed**',
                `These roles have been removed from you: ${roleNames.join(', ')}`
            );
        }
        if (this.cannotUseVoiceChannels && this.guildMember) {
            this.guildMember.voice.setDeaf(true, 'User disciplined with cannotUseVoiceChannels restriction.');
            this.guildMember.voice.setMute(true, 'User disciplined with cannotUseVoiceChannels restriction.');
        }
        if (this.cannotUseVoiceChannels) {
            this.userEmbed.addField(
                ':lock: **Cannot use the voice channels anymore**',
                'Your access to all voice channels has been revoked indefinitely.'
            );
        }
        if (this.cannotGiveReputation) {
            this.userEmbed.addField(
                ':lock: **Cannot give reputation anymore**',
                'You are no longer able to give members reputation via the reputation command nor the reaction.'
            );
        }
        if (this.cannotUseStaffCommand) {
            this.userEmbed.addField(
                ':lock: **Cannot use the staff command anymore**',
                'You can no longer use the staff command to create channels with staff. If you need staff for any reason, you must send a DM.'
            );
        }
        if (this.cannotUseReportCommand) {
            this.userEmbed.addField(
                ':lock: **Cannot use the report command anymore**',
                'You can no longer use the report command to self-moderate troublesome members. But you can still notify staff of problematic members.'
            );
        }
        if (this.cannotUseSupportCommand) {
            this.userEmbed.addField(
                ':lock: **Cannot use the support command anymore**',
                'You can no longer use the support command to create opt-in channels to discuss sensitive support topics. If you need support, you can DM a member with their permission.'
            );
        }
        if (this.cannotUseConflictCommand) {
            this.userEmbed.addField(
                ':lock: **Cannot use the conflict command anymore**',
                'You can no longer use the conflict command. If a fight is occurring in the guild, you can still notify staff about it.'
            );
        }

        if (this.cannotEditProfile) {
            this.userEmbed.addField(
                ':lock: **Cannot edit profile anymore**',
                'You are no longer allowed to edit your profile. Please contact staff if you have something important that needs changed on your profile.'
            );
        }

        // Check reflection (class D) discipline
        this.classD();

        // remove XP
        if (this.xp > 0) {
            this.userEmbed.addField(
                `:fleur_de_lis: **${this.xp} XP has been retracted from you**`,
                `You now have ${this.memberProfile.XP - this.xp} XP.`
            );
            await Member.updateOne(
                {
                    guildID: this.guild.id,
                    userID: this.user.id,
                },
                {
                    XP: this.memberProfile.XP - this.xp,
                }
            );

            // TODO
            // if (guildMember) await sails.helpers.xp.checkRoles(guildMember);
        }

        // remove coins
        // TODO: Make it also effective to the bank
        if (this.coins > 0) {
            this.userEmbed.addField(
                `:gem: **You were fined $${this.coins} coins**`,
                `You now have $${this.memberProfile.coins - this.coins} coins.`
            );
            await Member.updateOne(
                {
                    guildID: this.guild.id,
                    userID: this.user.id,
                },
                {
                    coins: this.memberProfile.coins - this.coins,
                }
            );
        }

        // Violation Points
        if (this.vpts > 0) {
            // TODO: VPT decay
            this.userEmbed.addField(
                `:broken_heart: **${this.vpts} Violation Points were added**`,
                `You now have ${this.memberSettings.vpts + this.vpts} violation points.` +
                    '\n' +
                    'Staff may decide to issue more severe discipline when you have more violation points on your account.'
            );
        }

        // Additional info
        if (this.additionalInfo) {
            this.userEmbed.addField(':notepad_spiral: **Additional information / discipline**', this.additionalInfo);
        }

        // If the member is no longer in the guild, issue the ban or tempban immediately, and undo the mute
        if (!this.guildMember) {
            if (this.banDuration !== null && this.type !== 'discord-ban') {
                // Apply the ban
                await this.guild.members.ban(this.user, {
                    days: this.type === 'investigation' ? 0 : 7,
                    reason: this.reason,
                });
                if (!this.tasks || this.banDuration === 0) {
                    await Member.updateOne(
                        {
                            guildID: this.guild.id,
                            userID: this.user.id,
                        },
                        {
                            muted: false,
                        }
                    );
                }
            }
        }
    }

    private async raidScore() {
        // TODO: Add raid score
        // eslint-disable-next-line no-empty
        switch (
            this.type
            // case "Warning":
            // case "Basic Discipline":
            //     await sails.helpers.guild.addRaidScore(this.guild, 10);
            //     break;
            // case "Antispam Discipline":
            //     await sails.helpers.guild.addRaidScore(this.guild, 20);
            //     // TODO: Add slow decay score
            //     break;
            // case "Reflection / Research":
            // case "Access Restrictions":
            //     await sails.helpers.guild.addRaidScore(this.guild, 20);
            //     break;
            // case "Ban":
            // case "Investigation":
            //     await sails.helpers.guild.addRaidScore(this.guild, 30);
            //     break;
            // default:
            //     await sails.helpers.guild.addRaidScore(this.guild, 10);
            //     break;
        ) {
        }
    }

    private async sendUserEmbed() {
        this.userEmbed.setColor(colour(this.type));
        if (this.channel) {
            console.log(this.channel);
            this.channel.send(this.userEmbed);
        } else {
            try {
                await this.user.send(this.userEmbed);
            } catch (e) {
                console.log(`CANNOT SEND MESSAGES TO USER`);
            }
        }
    }

    private async postEmbeds() {
        if (this.type === 'kick') {
            await send(
                'modLogChannel',
                this.guild,
                `:warning: Discipline was issued against ${this.user.tag} (${this.user.id}). They have been kicked.`,
                {}
            );
        } else {
            await send(
                'modLogChannel',
                this.guild,
                `:warning: Discipline was issued against ${this.user.tag} (${this.user.id}). Below is an embed of their disciplinary message.`,
                {
                    embed: this.userEmbed,
                }
            );
        }

        // Post in the public channel
        await send('publicModLogChannel', this.guild, '', {
            embed: this.publicEmbed,
        });
    }
}

function colour(type: string | null) {
    switch (type) {
        case 'kick':
            return '#6c757d';
        case 'ban':
        case 'discord-ban':
            return '#dc3545';
        case 'antispam':
            return '#17a2b8';
        case 'warning':
            return '#ffc107';
        case 'string':
            return '#ff851b';
        case 'reflection':
            return '#605ca8';
        case 'discipline':
            return '#007bff';
        case 'investigation':
            return '#f012be';
        default:
            return '#ffffff';
    }
}
