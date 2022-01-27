"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const discord_js_1 = __importDefault(require("discord.js"));
const _ = __importStar(require("fs"));
const p = __importStar(require("path"));
const Command_1 = require("./Command");
const Event_1 = require("./Event");
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const Intent_1 = require("./Intent");
class Client extends discord_js_1.default.Client {
    constructor(token, options) {
        super(options ? options : Intent_1.Intents.ALL);
        this.commands = new discord_js_1.default.Collection();
        this.events = new discord_js_1.default.Collection();
        this.token = token;
    }
    loadCommands(path) {
        _.readdirSync(p.resolve(path)).forEach(obj => {
            if (obj.endsWith('.js')) {
                let help = require(p.resolve(`${path}/${obj}`));
                this.commands.set(obj.split(".")[0], new Command_1.Command(help.default));
            }
            else {
                const dir = _.readdirSync(p.resolve(`${path}/${obj}`)).filter(files => files.endsWith(".js"));
                for (const file of dir) {
                    let help = require(p.resolve(`${path}/${obj}/${file}`));
                    this.commands.set(file.split(".")[0], new Command_1.Command(help.default));
                }
            }
        });
    }
    loadEvents(path) {
        _.readdirSync(p.resolve(path)).forEach(obj => {
            if (obj.endsWith('.js')) {
                const event = require(p.resolve(`${path}/${obj}`));
                const evtName = obj.split('.')[0];
                this.events.set(evtName, new Event_1.Event(event, this, evtName));
            }
            else {
                const events = _.readdirSync(p.resolve(`${path}/${obj}/`)).filter(files => files.endsWith(".js"));
                for (const file of events) {
                    const event = require(p.resolve(`${path}/${obj}/${file}`));
                    const evtName = file.split('.')[0];
                    this.events.set(evtName, new Event_1.Event(event, this, evtName));
                }
            }
        });
        this.events.forEach((event) => {
            this.on(event.name, event.run());
        });
    }
    registerInteractions(guild) {
        const rest = new rest_1.REST({ version: '9' }).setToken(this.token);
        let commands = [];
        this.commands.forEach((command) => {
            commands.push(command.build(this));
        });
        if (!this.user) {
            return console.log('Invalid client !');
        }
        if (!guild) {
            this.guilds.cache.forEach(g => {
                var _a;
                if (!((_a = this.user) === null || _a === void 0 ? void 0 : _a.id)) {
                    return console.log('Invalid client !');
                }
                rest.put(v9_1.Routes.applicationGuildCommands(this.user.id, g.id), { body: commands })
                    .then(() => console.log('Successfully registered application commands.'))
                    .catch(console.error);
            });
        }
        else {
            rest.put(v9_1.Routes.applicationGuildCommands(this.user.id, guild.id), { body: commands })
                .then(() => console.log('Successfully registered application commands.'))
                .catch(console.error);
        }
    }
    init(commandsPathFolder, eventsPathFolder) {
        this.loadCommands(commandsPathFolder);
        this.loadEvents(eventsPathFolder);
        this.login(this.token);
        this.on('ready', () => {
            this.registerInteractions();
        });
    }
}
exports.Client = Client;
