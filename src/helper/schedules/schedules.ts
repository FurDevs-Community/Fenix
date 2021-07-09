import HozolClient from '../../lib/HozolClient';
import { ISchedule, Schedules } from '../../database/Schemas/Schedules';
import { CronJob } from 'cron';
import { executeTask } from '../general/executeTask';

export async function addSchedule(client: HozolClient, record: ISchedule) {
    await Schedules.find({ uid: record.uid }).then(async (data) => {
        if (!data) return;
        removeSchedule(client, record);
        if (record.nextRun && !record.cron) {
            // Removes Stale Schedules if not removed
            if (client.moment().isAfter(record.nextRun)) {
                if (record.catchUp) {
                    await executeTask(client, record);
                }
                await destroySchedule(client, record);
            }
            (async (record: ISchedule) => {
                client.schedules[record.uid] = new CronJob(
                    client.moment(record.nextRun).toDate(),
                    async () => {
                        await executeTask(client, record);
                        await destroySchedule(client, record);
                    },
                    null,
                    true
                );
            })(record);
        } else if (record.cron) {
            if (
                record.nextRun &&
                client.moment().isBefore(client.moment(record.nextRun))
            ) {
                (async (record: ISchedule) => {
                    client.schedules[record.uid] = new CronJob(
                        client.moment(record.nextRun).toDate(),
                        async () => {
                            client.schedules[record.uid].stop();
                            client.schedules[record.uid] = new CronJob(
                                record.cron,
                                async () => {
                                    // TODO: Run the task
                                    await executeTask(client, record);
                                    Schedules.updateOne(
                                        { uid: record.uid },
                                        {
                                            lastRun: client.moment().format(),
                                        }
                                    );
                                },
                                null,
                                true,
                                'UTC',
                                null,
                                true
                            );
                        },
                        null,
                        true
                    );
                })(record);
            } else {
                (async (record: ISchedule) => {
                    client.schedules[record.uid] = new CronJob(
                        record.cron,
                        async () => {
                            await executeTask(client, record);
                            await Schedules.updateOne(
                                { uid: record.uid },
                                { lastRun: client.moment().format() }
                            );
                        },
                        null,
                        true,
                        'UTC'
                    );
                })(record);
            }
        }
    });
}

export async function removeSchedule(client: HozolClient, record: ISchedule) {
    if (typeof client.schedules[record.uid] !== 'undefined') {
        client.schedules[record.uid].stop();
        delete client.schedules[record.uid];
    }
}

export async function destroySchedule(client: HozolClient, record: ISchedule) {
    try {
        await Schedules.findOneAndDelete({ uid: record.uid });
    } catch (e) {
        console.error(e);
    }
}
