import { Schedules } from '../../database';
import HozolClient from '../../lib/HozolClient';
import { addSchedule } from '../schedules/schedules';

/**
 * This will schedule the tasks that are currently in the database
 */
export async function cron(client: HozolClient) {
    client.debug('Setting Up Schedules');
    const records = await Schedules.find({});
    records.forEach(async (record) => {
        await addSchedule(client, record)
            .then(() => {
                client.debug('Loaded Schedule: ' + record.uid);
            })
            .catch((e) => client.error('Problem Loading Schedule: ' + record.uid + 'Error:\n' + e));
    });

    const SYSMIN = await Schedules.findOne({ uid: `globalMinute` });
    if (!SYSMIN) {
        client.warn(`Creating new Minute Task Schdule for the Bot`);
        await Schedules.create({
            uid: `globalMinute`,
            task: 'globalMinute',
            data: {},
            nextRun: client.moment().add(1, 'minute').toISOString(true),
            cron: '0 * * * * *',
        }).then(async (data) => {
            await addSchedule(client, data)
                .then(() => {
                    client.debug('Loaded Schedule: ' + data.uid);
                })
                .catch((e) => client.error('Problem Loading Schedule: ' + data.uid + 'Error:\n' + e));
        });
    }

    client.guilds.cache.forEach(async (g) => {
        const minuteTask = await Schedules.findOne({ uid: `MIN-${g.id}` });

        if (!minuteTask) {
            client.warn(`Creating new Minute Task Schdule for ${g.id}`);
            await Schedules.create({
                uid: `MIN-${g.id}`,
                task: 'minuteTasks',
                data: {
                    guild: g.id,
                },
                nextRun: client.moment().add(1, 'minute').toISOString(true),
                cron: '0 * * * * *',
            }).then(async (data) => {
                await addSchedule(client, data)
                    .then(() => {
                        client.debug('Loaded Schedule: ' + data.uid);
                    })
                    .catch((e) => client.error('Problem Loading Schedule: ' + data.uid + 'Error:\n' + e));
            });
        }
    });
}
