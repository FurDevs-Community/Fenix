/* eslint-disable require-jsdoc */
import HozolClient from '../../lib/HozolClient';
import { ISchedule } from '../../database';
import { removeBan } from '../tasks/removeBan';
import { removeMute } from '../tasks/removeMute';
import { updateStats } from '../tasks/updateStats';
import { Guild } from 'discord.js';
import { minuteBotTask } from '../tasks/SYS-MIN';

export async function executeTask(client: HozolClient, record: ISchedule) {
    let g: Guild;
    switch (record.task) {
        case 'removeBan':
            removeBan(client, record, error);
            break;
        case 'removeMute':
            removeMute(client, record, error);
            break;
        case 'minuteTask':
            if (!record.data.guild) return;
            g = client.guilds.cache.get(record.data.guild) as Guild;
            if (!g) return;
            updateStats(client, g);
            break;
        case 'updateStats':
            if (!record.data.guild) return;
            g = client.guilds.cache.get(record.data.guild) as Guild;
            if (!g) return;
            updateStats(client, g);
            break;
        case 'SYSMIN':
            minuteBotTask();
            break;
    }
}

function error(client: HozolClient) {
    client.log(
        'The bot was unable to unban a temporarly banned user due to missing guild/user data'
    );
}
