"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Intents = void 0;
const discord_js_1 = __importDefault(require("discord.js"));
exports.Intents = {
    ALL: {
        partials: ["REACTION", "MESSAGE"],
        intents: [discord_js_1.default.Intents.FLAGS.GUILDS, discord_js_1.default.Intents.FLAGS.GUILD_BANS, discord_js_1.default.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, discord_js_1.default.Intents.FLAGS.GUILD_INTEGRATIONS, discord_js_1.default.Intents.FLAGS.GUILD_INVITES, discord_js_1.default.Intents.FLAGS.GUILD_MEMBERS, discord_js_1.default.Intents.FLAGS.GUILD_MESSAGES, discord_js_1.default.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, discord_js_1.default.Intents.FLAGS.GUILD_MESSAGE_TYPING, discord_js_1.default.Intents.FLAGS.GUILD_PRESENCES, discord_js_1.default.Intents.FLAGS.GUILD_VOICE_STATES, discord_js_1.default.Intents.FLAGS.GUILD_WEBHOOKS]
    }
};
