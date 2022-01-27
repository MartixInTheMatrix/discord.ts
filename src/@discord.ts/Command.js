"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const builders_1 = require("@discordjs/builders");
const getOptionsFunctionForType = (builder, type) => {
    switch (type) {
        case "BOOLEAN": return builder.addBooleanOption;
        case "CHANNEL": return builder.addChannelOption;
        case "NUMBER": return builder.addNumberOption;
        case "ROLE": return builder.addRoleOption;
        case "STRING": return builder.addStringOption;
        case "USER": return builder.addUserOption;
        default: return builder.addStringOption;
    }
};
class Command {
    constructor(help) {
        this.help = help,
            this.name = help.name,
            this.description = help.description,
            this.type = help.type,
            this.options = help.options,
            this.defaultPermission = help.defaultPermission;
    }
    build(client) {
        if (!this.type || this.type === "CHAT_INPUT") {
            let builder = new builders_1.SlashCommandBuilder();
            builder.setName(this.name);
            builder.setDescription(this.description);
            if (this.options) {
                this.options.forEach((option) => {
                    getOptionsFunctionForType(builder, option.type).call(builder, (((opt) => {
                        opt.setName(option.name);
                        opt.setDescription(option.description);
                        opt.setRequired(option.required === undefined ? true : !option.required ? false : true);
                        if (option.choices) {
                            opt.addChoices(option.choices.map((v) => { var _a; return [(_a = v.label) !== null && _a !== void 0 ? _a : v.value, v.value]; }));
                        }
                        return opt;
                    })));
                });
            }
            if (this.defaultPermission) {
                builder.setDefaultPermission(false);
            }
            return builder.toJSON();
        }
        else {
            client.guilds.cache.forEach((g) => {
                g.commands.set([
                    {
                        name: this.name,
                        type: this.type === "MESSAGE" ? 2 : 3
                    }
                ]);
                return {};
            });
        }
    }
}
exports.Command = Command;
