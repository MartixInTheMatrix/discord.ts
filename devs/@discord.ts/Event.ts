import discord from "discord.js"
import { Client } from "./Client";

export class Event {
    
    exec: any;
    name: string;
    Client: Client;

    constructor(event:any, client: Client, name: string) {
        this.exec = event.default;
        this.name = name;
        this.Client = client;
    }

    run(){
        return this.exec.bind(null, this.Client)
    }
    
}