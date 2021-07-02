import { Guild, Message, MessageEmbed } from 'discord.js';
import { IAntiSpam, IGuild } from '../../database';

export class Setup {
    public guild: Guild;
    public settings: IGuild;
    public message: Message;
    public embed: MessageEmbed;
    public antispam: IAntiSpam;
    public embedContent: string;
    constructor(message: Message, embed: MessageEmbed, description: string) {
        this.message = message;
        this.embed = embed;
        this.embedContent = description;
    }

    async initalize() {
        this.embedContent = `⌛ Warming up`;
        this.embed.setDescription(this.embedContent);
        this.message.edit(this.embedContent);
        if (!this.message.guild) {
            throw new Error('This may be only used in guilds');
        }
        this.settings = await this.message.guild.settings();
        this.antispam = await this.message.guild.antispam();
    }
}
