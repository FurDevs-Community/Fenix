import { exec } from 'child_process';

/**
 * Executes a command
 *
 * @param command
 * @return The results and errors if any
 */
export function execute(command: string) {
    return new Promise((resolve) => {
        exec(command, async (err, stdout, stderr) => {
            if (err != null) {
                resolve([err, null]);
            } else if (typeof stderr !== 'string') {
                resolve([stderr, null]);
            } else {
                resolve([null, stdout]);
            }
        });
    });
}
