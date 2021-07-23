// Imports
import { Router } from 'express';
import { IProfile, Profiles } from '../../database';
// eslint-disable-next-line new-cap
const router = Router();

// router.get('/:guildID/user/:id/moderation/:uid', async (req, res) => {
//     const { guildID, id, uid } = req.params;
//     const moderation = await Moderations.findOne({
//         guildID,
//         userID: id,
//         cases: uid,
//     });

//     res.json(moderation);
// });

router.get('/:guildID/settings', async (req, res) => {
    const bearer = req.headers['authorization']!.slice(7);
    if (bearer === process.env.BOTAPISECRET) {
        console.log('passed');
        const { guildID } = req.params;
        console.log(guildID);
        const guild = req.client.guilds.cache.get(guildID);
        if (guild) {
            console.log('guild found');
            const moderation = await guild?.automoderation();
            const moderations = await guild?.moderation();
            const settings = await guild?.settings();
            const antiraid = await guild?.antiraid();
            const antispam = await guild?.antispam();
            const channels = guild.channels.cache.toJSON();
            const roles = guild.roles.cache.toJSON();
            console.log('got all infos. sending...');
            res.json({
                moderation,
                moderations,
                settings,
                antiraid,
                antispam,
                guild,
                channels,
                roles,
            });
        } else {
            res.json({ error: 'Guild cannot be found' });
        }
    } else {
        res.json({ error: 'haha you tried lmfao, go suck a duck' });
    }
});

// Public API, just in case some dev wanna add like leaderboards to the their website :)
// router.get('/:guildID/top10', async (req, res) => {
//     const { guildID } = req.params;
//     const guild = req.client.guilds.cache.get(guildID);
//     if (guild) {
//         const members = await (await Profiles.find({ guild: guild.id })).forEach(mem => [...mems, mem])
//         .sort((memberOne: IProfile, memberTwo: IProfile) => {
//             return memberTwo.XP - memberOne.XP;
//         });
//         // members.slice(0, 10);
//         console.log(members);
//         res.json(members);
//     } else {
//         res.json({ error: 'Guild cannot be found' });
//     }
// });

// router.post('/:guildID/user/:id/moderation/new', async (req, res) => {
//     // TODO
//     res.send('End Point not setup');
// });

// router.get(`/:id/user/:userID`, async (req, res) => {
//     const { id, userID } = req.params;
//     const member = await Members.findOne({
//         guildID: id,
//         userID,
//     });
//     res.json(member);
// });

export default router;
