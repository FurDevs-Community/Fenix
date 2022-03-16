import { ClientEvents } from 'discord.js';
import FenixClient from '../lib/FenixClient';

export default abstract class BaseEvent {
    public client: FenixClient;
    public eventName: keyof ClientEvents;
    constructor(client: FenixClient, options: { eventName: keyof ClientEvents }) {
        this.client = client;
        this.eventName = options.eventName;
    }

    abstract run(client: FenixClient, ...args: any): void;
}
