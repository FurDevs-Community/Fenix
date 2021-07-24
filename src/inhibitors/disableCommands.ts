import { Message } from 'discord.js';
import { Command, Inhibitor } from 'nukejs';

module.exports = class extends Inhibitor {
    constructor() {
        super({
            name: 'disableInhibtors',
            enabled: true,
        });
    }

    async run(message: Message, command: Command, loaderName: string) {
        if (!message.guild) return;
        const settings = await message.guild.settings();
        const disableCommands = settings.disabledCommands;
        if (disableCommands.indexOf(command.name) !== -1) {
            throw new Error('This command is disabled. You can re-enable it by using the enable command');
        }
    }
};
