export function numberToEmoji(number: number) {
    const numberAsArray = number.toString().split('');
    // @ts-expect-error
    return numberAsArray.map((num) => numberAsEmoji[num]).join('');
}

const numberAsEmoji = {
    '0': ':zero:',
    '1': ':one:',
    '2': ':two:',
    '3': ':three:',
    '4': ':four:',
    '5': ':five:',
    '6': ':six:',
    '7': ':seven:',
    '8': ':eight:',
    '9': ':nine:',
};

console.log(numberToEmoji(10));
