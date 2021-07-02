// Imports
import { Router } from 'express';
import { Moderations } from '../../database/Schemas/Moderation';
// eslint-disable-next-line new-cap
const router = Router();
import GuildRouter from './guild';
const { version } = require('./../../../package.json');

router.use('/guild', GuildRouter);
router.get('/botVersion', (req, res) => {
    res.status(200).send({ botVersion: version });
});
router.get(`/modLogs`, async (req, res) => {
    const modLogs = await Moderations.find({});
    res.json({ modLogs: modLogs.length });
});
export default router;
