import HozolClient from '../../lib/HozolClient';
import { ISchedule } from '../../database';
export async function executeTask(client: HozolClient, record: ISchedule) {
    if (record.task) {
        const { task } = await import(`./../tasks/${record.task}`);
        task(client, record).catch((e: string) => {
            client.error(`There was an error executing ${record.task} ${e}`);
        });
    }
}
