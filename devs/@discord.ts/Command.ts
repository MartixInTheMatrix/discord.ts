import discord from "discord.js"
import { SlashCommandBuilder, ContextMenuCommandBuilder } from '@discordjs/builders';
import { Client } from "./Client";


export class Command {
    help: any;
    name: string;
    description: string;
    type: discord.ApplicationCommandType;
    options: any;
    defaultPermission: any;

    constructor(help:any){
        this.help = help,
        this.name = help.default.name,
        this.description = help.default.description,
        this.type = help.default.type,
        this.options = help.default.options,
        this.defaultPermission = help.default.defaultPermission
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

    run(Client: Client, interaction: discord.CommandInteraction){
        this.help.run(Client, interaction, interaction.options.resolved)
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