import { IDiscipline, IModeration } from '../../database';

export async function checkActions(
    moderation: IModeration[],
    action: string
): Promise<Boolean> {
    // filter out appealed mod logs
    if (moderation) {
        const records = moderation.filter((log: any) => !log.appealed);

        let hasAction = false;

        // Go through every mod record and its discipline records to see if the action has been applied
        if (records && records.length > 0) {
            records.map((record) => {
                const disciplines = <IDiscipline[]>(
                    (<unknown>record.populate('discipline'))
                );
                if (disciplines && disciplines.length > 0) {
                    const _record = disciplines.find(
                        (discipline: any) =>
                            discipline.action === action &&
                            discipline.status === 'active'
                    );
                    if (_record) hasAction = true;
                }
            });
        }
        console.log(hasAction);
        return hasAction;
    } else {
        return false;
    }
}
