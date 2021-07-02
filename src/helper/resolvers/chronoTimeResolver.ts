import HozolClient from '../../lib/HozolClient';
import chrono from 'chrono-node';

export async function chronoTimeResolver(client: HozolClient, dateString: any) {
    const date = chrono.parse(dateString, new Date(), {
        forwardDate: true,
    });
    if (date === null) {
        throw new Error(
            `Unrecognized date, time, or duration of time provided for ${date}`
        );
    }
    if (client.moment().isAfter(client.moment(date))) {
        return client.moment(date).add(1, 'days').toDate();
    }
    return date;
}
