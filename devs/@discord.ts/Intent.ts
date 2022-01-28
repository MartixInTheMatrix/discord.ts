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