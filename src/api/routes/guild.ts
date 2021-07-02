// Imports
import { Router } from 'express';
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
    console.log('bearer');
    console.log(bearer);
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
            console.log('got all infos. sending...');
            res.json({
                moderation,
                moderations,
                settings,
                antiraid,
                antispam,
                guild,
            });
        } else {
            res.json({ error: 'Guild cannot be found' });
        }
    } else {
        res.json({ error: 'haha you tried lmfao, go suck a duck' });
    }
});

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
