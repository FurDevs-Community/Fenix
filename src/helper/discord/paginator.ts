import { Message, MessageEmbed, TextChannel } from 'discord.js';

export class DiscordMenu {
    channel: any;
    pages: MessageEmbed[];
    time: number;
    reactions: { first: string; back: string; next: string; last: string; stop: string };
    page: number;
    messages: { message: string; fn: any }[];
    msg: Message;
    reactionCollector: any;
    messageCollector: any;
    constructor(
        channel: TextChannel,
        uid: string,
        pages: MessageEmbed[],
        messages: { message: string; fn: any }[] = [],
        time = 180000,
        reactions = { first: '⏪', back: '◀', next: '▶', last: '⏩', stop: '⏹' }
    ) {
        this.channel = channel;
        this.pages = pages;
        this.time = time;
        this.reactions = reactions;
        this.page = 1;
        this.messages = messages;
        channel.send(pages[0]).then((msg: any) => {
            this.msg = msg;
            this.addReactions();
            this.createReactionCollector(uid);
            this.createMessageCollector(uid);
        });
    }
    select(pg = 1) {
        this.page = pg;
        this.msg.edit(this.pages[pg - 1]);
    }
    createReactionCollector(uid: any) {
        const reactionCollector = this.msg.createReactionCollector((r: any, u: { id: any }) => u.id == uid, {
            time: this.time,
        });
        this.reactionCollector = reactionCollector;
        reactionCollector.on('collect', (r: { emoji: { name: any }; users: { remove: (arg0: any) => void } }) => {
            if (r.emoji.name == this.reactions.first) {
                if (this.page != 1) this.select(1);
            } else if (r.emoji.name == this.reactions.back) {
                if (this.page != 1) this.select(this.page - 1);
            } else if (r.emoji.name == this.reactions.next) {
                if (this.page != this.pages.length) this.select(this.page + 1);
            } else if (r.emoji.name == this.reactions.last) {
                if (this.page != this.pages.length) this.select(this.pages.length);
            } else if (r.emoji.name == this.reactions.stop) {
                reactionCollector.stop();
            }
            r.users.remove(uid);
        });
        reactionCollector.on('end', () => {
            this.endCollection();
        });
    }
    createMessageCollector(uid: any) {
        const messageCollector = this.channel.createMessageCollector(
            (m: { author: { id: any }; cleanContent: string }) =>
                m.author.id === uid &&
                this.messages.some((m2) => m2.message.toLowerCase() === m.cleanContent.toLowerCase()),
            { time: this.time }
        );
        this.messageCollector = messageCollector;
        messageCollector.on('collect', (m: { cleanContent: string }) => {
            console.log('gay');
            this.endCollection();
            const msgTrigger = this.messages.find(
                (m2: { message: string }) => m2.message.toLowerCase() === m.cleanContent.toLowerCase()
            );
            if (msgTrigger && msgTrigger.fn) {
                msgTrigger.fn(m);
            }
        });
        messageCollector.on('end', () => {
            this.endCollection();
        });
    }
    async endCollection() {
        this.msg.delete().catch(() => {});
        if (this.reactionCollector && !this.reactionCollector.ended) this.reactionCollector.stop();
        if (this.messageCollector && !this.messageCollector.ended) this.messageCollector.stop();
    }
    async addReactions() {
        if (!this.msg.deleted) {
            if (this.reactions.first) await this.msg.react(this.reactions.first).catch(() => {});
            if (this.reactions.back) await this.msg.react(this.reactions.back).catch(() => {});
            if (this.reactions.next) await this.msg.react(this.reactions.next).catch(() => {});
            if (this.reactions.last) await this.msg.react(this.reactions.last).catch(() => {});
            if (this.reactions.stop) await this.msg.react(this.reactions.stop).catch(() => {});
        }
    }
}
