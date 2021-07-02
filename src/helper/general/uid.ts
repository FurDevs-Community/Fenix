import random from 'crypto-random-string';

/**
 * This will generate an String with an Unique String that's based on data and the string
 *
 * @return A string with random characters.
 */
export async function uid(): Promise<string> {
    const intial = await Date.now().toString(16);
    return `${intial}${random({ length: 16 - intial.length })}`;
}
