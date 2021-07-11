import { Snowflake } from 'discord.js';
import { AntiRaids as AntiRaid } from './../database/Schemas/AntiRaid';
import { AntiSpams as AntiSpam } from './../database/Schemas/AntiSpam';
import { Rule as Rules } from './../database/Schemas/Rules';
import { Moderations as Moderation } from './../database/Schemas/Moderation';
import { Guilds as Guild } from './../database/Schemas/Guild';
import { Clients as Client } from './../database/Schemas/Client';
import { Automoderation as AutoModeration } from './Schemas/AutoModeration';
import { IMember, Members as Member } from './Schemas/Member';
import { Profiles as Profile } from './Schemas/Profile';

export async function findOrCreateAntiRaid(guildID: Snowflake) {
    let data = await AntiRaid.findOne({ guildID: guildID });
    if (data) {
        return data;
    } else {
        data = new AntiRaid({ guildID: guildID });
        await data.save().catch((err: any) => {
            return err;
        });
        return data;
    }
}

export async function findOrCreateClient(guildID: Snowflake) {
    let data = await Client.findOne({ guildID: guildID });
    if (data) {
        return data;
    } else {
        data = new Client({ id: 1 });
        await data.save().catch((err: any) => {
            return err;
        });
        return data;
    }
}

export async function findOrCreateAntiSpam(guildID: Snowflake) {
    let data = await AntiSpam.findOne({ guildID: guildID });
    if (data) {
        return data;
    } else {
        data = new AntiSpam({ guildID: guildID });
        await data.save().catch((err: any) => console.error(err));
        return data;
    }
}

export async function findOrCreateMemberSettings(guildID: Snowflake, userID: Snowflake) {
    let data = await Member.findOne({ guildID: guildID, userID: userID });
    if (data) {
        return data;
    } else {
        data = new Member({ guildID: guildID, userID: userID });
        await data.save().catch((err: any) => console.error(err));
        return data;
    }
}

export async function findOrCreateProfile(guildID: Snowflake, userID: Snowflake) {
    let data = await Profile.findOne({ guildID: guildID, userID: userID });
    if (data) {
        return data;
    } else {
        data = new Profile({ guildID: guildID, userID: userID });
        await data.save().catch((err: any) => console.error(err));
        return data;
    }
}

export async function findOrCreateAutoModeration(guildID: Snowflake) {
    let data = await AutoModeration.findOne({ guildID: guildID });
    if (data) {
        return data;
    } else {
        data = new AutoModeration({ guildID: guildID });
        await data.save().catch((err: any) => console.error(err));
        return data;
    }
}

let wasCreated;

export async function findOrCreateGuilds(guildID: Snowflake) {
    let data = await Guild.findOne({ guildID: guildID });
    if (data) {
        wasCreated = false;
        return [data, wasCreated];
    } else {
        data = new Guild({ guildID: guildID });
        await data.save().catch((err: any) => console.error(err));
        wasCreated = true;
        return [data, wasCreated];
    }
}

export async function findGuild(guildID: Snowflake) {
    const data = await Guild.findOne({ guildID: guildID })
        .exec()
        .catch((err: any) => {
            return err;
        });
    return data;
}

export async function findAntiSpam(guildID: Snowflake) {
    const data = await AntiSpam.findOne({ guildID: guildID }).catch((err: any) => {
        return err;
    });
    return data;
}

export async function addNote(guildID: string, userID: string, note: string) {
    const data = await Member.findOne({
        guildID: guildID,
        userID: userID,
    }).catch((err: any) => {
        return err;
    });
    const notes = data.notes.push(note);
    const newData = await AntiRaid.updateOne({ guildID: guildID, userID: userID }, { notes: notes }).catch(
        (err: any) => {
            return err;
        }
    );
    return newData;
}

export async function findAntiRaid(guildID: Snowflake) {
    const data = await AntiRaid.findOne({ guildID: guildID }).catch((err: any) => {
        return err;
    });
    return data;
}

export async function findModeration(guildID: Snowflake) {
    const data = await Moderation.find({ guildID: guildID }).catch((err: any) => {
        return err;
    });
    return data;
}

export async function findMemberModeration(guildID: Snowflake, userID: Snowflake) {
    const data = await Moderation.find({
        guildID: guildID,
        userID: userID,
    }).catch((err: any) => {
        return err;
    });
    return data;
}

export async function findOneMemberSettings(guildID: Snowflake, userID: Snowflake): Promise<IMember> {
    const data = await Member.findOne({
        guildID: guildID,
        userID: userID,
    }).catch((err: any) => {
        return err;
    });
    return data;
}

export async function findOneMemberProfile(guildID: Snowflake, userID: Snowflake) {
    const data = await Profile.findOne({
        guildID: guildID,
        userID: userID,
    }).catch((err: any) => {
        return err;
    });
    return data;
}

export async function findRules(guildID: Snowflake) {
    const data = await Rules.find({ guildID: guildID }).catch((err: any) => {
        return err;
    });
    return data;
}

export async function updatePrefix(guildID: Snowflake, prefix: string) {
    const data = await Guild.updateOne({ guildID: guildID }, { prefix: prefix }).catch((err: any) => {
        console.error(err);
    });
    return data;
}

export async function updateChannel(guildID: any, channel: any, type: any) {
    const data = await Guild.updateOne({ guildID: guildID }, { [type]: channel }).catch((err: any) => {
        console.error(err);
    });
    return data;
}

export async function updateRole(guildID: any, role: any, type: any) {
    const data = await Guild.updateOne({ guildID: guildID }, { [type]: role }).catch((err: any) => {
        console.error(err);
    });
    return data;
}

export async function updateValue(guildID: any, role: any, type: any) {
    const data = await Guild.updateOne({ guildID: guildID }, { [type]: role }).catch((err: any) => {
        console.error(err);
    });
    return data;
}

export async function updateBoolean(guildID: any, stat: any, type: any) {
    if (stat === 'true') {
        stat = true;
    } else {
        stat = false;
    }
    const data = await Guild.updateOne({ guildID: guildID }, { [type]: stat }).catch((err: any) => {
        console.error(err);
    });
    return data;
}

export async function updateSpecify(guildID: any, stat: any, type: any) {
    const data = await Guild.updateOne({ guildID: guildID }, { [type]: stat }).catch((err: any) => {
        console.error(err);
    });
    return data;
}

export async function findAutoModeration(guildID: Snowflake) {
    const data = await AutoModeration.findOne({ guildID: guildID }).catch((err: any) => {
        return err;
    });
    return data;
}

export async function muteUser(guildID: Snowflake, userID: Snowflake) {
    const data = await Member.updateOne({ guildID: guildID, userID: userID }, { muted: true }).catch((err: any) => {
        return err;
    });
    return data;
}

export async function unMuteUser(guildID: Snowflake, userID: Snowflake): Promise<void> {
    await Member.updateOne({ guildID: guildID, userID: userID }, { muted: false }).catch((err: any) => {
        return err;
    });
    return;
}

export async function addReputation(guildID: Snowflake, userID: Snowflake, count: number) {
    const data = await Profile.findOne({ guildID: guildID, userID: userID });
    if (data) {
        const reps = data.reputation;
        const newReps = reps + count;
        await Profile.updateOne(
            { guildID: guildID, userID: userID },
            {
                reputation: newReps,
            }
        );
        return true;
    }
    return false;
}

export async function removeReputation(guildID: Snowflake, userID: Snowflake, count: number) {
    const data = await Profile.findOne({ guildID: guildID, userID: userID });
    if (data) {
        const reps = data.reputation;
        const newReps = reps - count;
        await Profile.updateOne(
            { guildID: guildID, userID: userID },
            {
                reputation: newReps,
            }
        ).catch((e) => {
            console.error(e);
            return false;
        });
        return true;
    }
    return false;
}

export async function addMoney(guildID: Snowflake, userID: Snowflake, moneyAdding: number) {
    const data = await Profile.findOne({ guildID: guildID, userID: userID });
    if (data) {
        const money = data.coins + moneyAdding;
        await Profile.updateOne({ guildID: guildID, userID: userID }, { coins: money }).catch((e) => {
            console.error(e);
            return false;
        });
        return true;
    }
    return false;
}

export async function removeMoney(guildID: Snowflake, userID: Snowflake, moneyAdding: number) {
    const data = await Profile.findOne({ guildID: guildID, userID: userID });
    if (data) {
        const money = data.coins - moneyAdding;
        await Profile.updateOne({ guildID: guildID, userID: userID }, { coins: money }).catch((e) => {
            console.error(e);
            return false;
        });
        return true;
    }
    return false;
}

export async function addMoneyToBank(guildID: Snowflake, userID: Snowflake, moneyAdding: number) {
    const data = await Profile.findOne({ guildID: guildID, userID: userID });
    if (data) {
        const money = data.coinsInBank - moneyAdding;
        await Profile.updateOne({ guildID: guildID, userID: userID }, { coinsInBank: money }).catch((e) => {
            console.error(e);
            return false;
        });
        return true;
    }
    return false;
}

export async function removeMoneyToBank(guildID: Snowflake, userID: Snowflake, moneyAdding: number) {
    const data = await Profile.findOne({ guildID: guildID, userID: userID });
    if (data) {
        const money = data.coinsInBank - moneyAdding;
        await Profile.updateOne({ guildID: guildID, userID: userID }, { coinsInBank: money }).catch((e) => {
            console.error(e);
            return false;
        });
        return true;
    }
    return false;
}

export * from './Schemas/AntiRaid';
export * from './Schemas/AntiSpam';
export * from './Schemas/AutoModeration';
export * from './Schemas/Badges';
export * from './Schemas/Client';
export * from './Schemas/Discipline';
export * from './Schemas/Guild';
export * from './Schemas/Logging';
export * from './Schemas/Member';
export * from './Schemas/Moderation';
export * from './Schemas/Profile';
export * from './Schemas/Rules';
export * from './Schemas/User';
export * from './Schemas/Schedules';
