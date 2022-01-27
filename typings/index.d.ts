import discord from "discord.js";
import * as _ from "fs";
import * as p from "path";
import { Command } from "./Command"
import { Event } from "./Event";
import { REST } from '@discordjs/rest';
import { Routes }from 'discord-api-types/v9';
import { Intents } from './addons'

export class Client extends discord.Client{

    commands: discord.Collection<string, Command>;
    events: discord.Collection<string, Event>;
    token: string;

    constructor(token: string, options?: discord.ClientOptions) {
        super(options? options : Intents.ALL);

        this.commands = new discord.Collection();
        this.events = new discord.Collection();
        this.token = token;
    }
    
    loadCommands(path: string){
        _.readdirSync(p.resolve(path)).forEach(obj => {

            if(obj.endsWith('.js')){
               let help = require(p.resolve(`${path}/${obj}`))

                this.commands.set(obj.split(".")[0], new Command(help.default))
            }else{
                const dir = _.readdirSync(p.resolve(`${path}/${obj}`)).filter(files => files.endsWith(".js"));
    
                for(const file of dir) {
                   let help = require(p.resolve(`${path}/${obj}/${file}`))
    
                    this.commands.set(file.split(".")[0], new Command(help.default))
                }
            }
            
        })
    }

    loadEvents(path: string){
        _.readdirSync(p.resolve(path)).forEach(obj => {
            if(obj.endsWith('.js')){
                const event = require(p.resolve( `${path}/${obj}`));
                const evtName = obj.split('.')[0];

                this.events.set(evtName, new Event(event, this, evtName))
            }else{
                
                const events = _.readdirSync(p.resolve(`${path}/${obj}/`)).filter(files => files.endsWith(".js"));
    
                for(const file of events) {

                    const event = require(p.resolve( `${path}/${obj}/${file}`));
                    const evtName = file.split('.')[0];

                    this.events.set(evtName, new Event(event, this, evtName))
                }
            }

        })

        this.events.forEach((event:any)=>{
            this.on(event.name, event.run())
        })
        
    }

    registerInteractions(guild?:any) {

        const rest = new REST({ version: '9' }).setToken(this.token);
        let commands: any = [];

        this.commands.forEach((command: Command)=>{
            commands.push(command.build(this))
        })
        if(!this.user){ return console.log('Invalid client !')}

        if(!guild){
            this.guilds.cache.forEach(g=>{
                if(!this.user?.id){ return console.log('Invalid client !')}

                rest.put(Routes.applicationGuildCommands(this.user.id, g.id), { body: commands })
                .then(() => console.log('Successfully registered application commands.'))
                .catch(console.error);
            })
           
        }else{
                rest.put(Routes.applicationGuildCommands(this.user.id, guild.id), { body: commands })
                .then(() => console.log('Successfully registered application commands.'))
                .catch(console.error);

        }
          
    }

    init(commandsPathFolder: string, eventsPathFolder: string){
        this.loadCommands(commandsPathFolder)
        this.loadEvents(eventsPathFolder)
        this.login(this.token)
        this.on('ready', () =>{
            this.registerInteractions()
        })
    }
    
}
import { SlashCommandBuilder, ContextMenuCommandBuilder } from '@discordjs/builders';



export class Command {
    help: any;
    name: string;
    description: string;
    type: discord.ApplicationCommandType;
    options: any;
    defaultPermission: any;

    constructor(help:any){
        this.help = help,
        this.name = help.name,
        this.description = help.description,
        this.type = help.type,
        this.options = help.options,
        this.defaultPermission = help.defaultPermission
    }

    build(client: discord.Client){
        if( !this.type || this.type === "CHAT_INPUT"){
            let builder: SlashCommandBuilder = new SlashCommandBuilder()
            builder.setName(this.name);
            builder.setDescription(this.description);

            if (this.options){
                this.options.forEach((option: any)=>{

                    this.getOptionsFunctionForType(builder, option.type).call(builder, ((opt: any)=>{
                            opt.setName(option.name);
                            opt.setDescription(option.description)
                            opt.setRequired(option.required === undefined ? true : !option.required? false : true);
    
                            if (option.choices) {
                                opt.addChoices(option.choices.map((v:any) => [v.label ?? v.value, v.value]))
                            }
    
                            return opt;            
                    }))  
                })

            }

            if (this.defaultPermission) {
                builder.setDefaultPermission(false);
            }

            return builder.toJSON();

        }else{
            client.guilds.cache.forEach((g)=>{
                g.commands.set([
                    {
                        name: this.name,
                        type: this.type === "MESSAGE"? 2 : 3
                    }
                ])

                return {}
            })

        }
    }
    
    private getOptionsFunctionForType(builder:any, type:any){
        switch (type) {
            case "BOOLEAN": return builder.addBooleanOption;
            case "CHANNEL": return builder.addChannelOption;
            case "NUMBER": return builder.addNumberOption;
            case "ROLE": return builder.addRoleOption;
            case "STRING": return builder.addStringOption;
            case "USER": return builder.addUserOption;
            default: return builder.addStringOption;
        }
    }
}

export class Event {
    
    exec: any;
    name: string;
    Client: CustomClient;

    constructor(event:any, client: CustomClient, name: string) {
        this.exec = event.default;
        this.name = name;
        this.Client = client;
    }

    run(){
        return this.exec.bind(null, this.Client)
    }
    
}
import discord from "discord.js";

class CIntents extends discord.Intents {
    GUILD: any;
    DIRECT_MESSAGES: any;
    ALL: any;

    constructor(){
        super();

        this.GUILD = [discord.Intents.FLAGS.GUILDS,discord.Intents.FLAGS.GUILD_BANS,discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,discord.Intents.FLAGS.GUILD_INTEGRATIONS,discord.Intents.FLAGS.GUILD_INVITES,discord.Intents.FLAGS.GUILD_MEMBERS,discord.Intents.FLAGS.GUILD_MESSAGES,discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,discord.Intents.FLAGS.GUILD_PRESENCES,discord.Intents.FLAGS.GUILD_VOICE_STATES,discord.Intents.FLAGS.GUILD_WEBHOOKS]
        this.DIRECT_MESSAGES = [discord.Intents.FLAGS.DIRECT_MESSAGES, discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING]
        this.ALL = [discord.Intents.FLAGS.GUILDS,discord.Intents.FLAGS.GUILD_BANS,discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,discord.Intents.FLAGS.GUILD_INTEGRATIONS,discord.Intents.FLAGS.GUILD_INVITES,discord.Intents.FLAGS.GUILD_MEMBERS,discord.Intents.FLAGS.GUILD_MESSAGES,discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,discord.Intents.FLAGS.GUILD_PRESENCES,discord.Intents.FLAGS.GUILD_VOICE_STATES,discord.Intents.FLAGS.GUILD_WEBHOOKS, discord.Intents.FLAGS.DIRECT_MESSAGES, discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING]
    }
}

export const Intents = new CIntents()
