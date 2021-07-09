export async function hasteful(code: string) {
    try {
        require('hastebin-gen')(code, {
            url: 'https://hastebin.com/',
        }).then((result: string) => {
            return result;
        });
    } catch (err) {
        console.error(err);
    }
}
