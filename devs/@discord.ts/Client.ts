import discord from "discord.js";
import * as _ from "fs";
import * as p from "path";
import { Command } from "./Command"
import { Event } from "./Event";
import { REST } from '@discordjs/rest';
import { Routes }from 'discord-api-types/v9';
import { Intents } from './Intent'

export class Client extends discord.Client {

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

                this.commands.set(obj.split(".")[0], new Command(help))
            }else{
                const dir = _.readdirSync(p.resolve(`${path}/${obj}`)).filter(files => files.endsWith(".js"));
    
                for(const file of dir) {
                   let help = require(p.resolve(`${path}/${obj}/${file}`))
    
                    this.commands.set(file.split(".")[0], new Command(help))
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