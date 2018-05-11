const { Command } = require("klasa");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            runIn: ["text"],
            cooldown: 10,
            bucket: 1,
            aliases: ["kickmember"],
            permissionLevel: 5,
            requiredPermissions: ["USE_EXTERNAL_EMOJIS", "KICK_MEMBERS"],
            description: (msg) => msg.language.get("COMMAND_KICK_DESCRIPTION"),
            quotedStringSupport: false,
            usage: "<member:user> [reason:string] [...]",
            usageDelim: " ",
            extendedHelp: "No extended help available."
        });
    }

    async run(msg, [member, ...reason]) {
        const user = msg.guild.members.get(member.id);

        if (user.id === msg.author.id) return msg.reply(`<:penguError:435712890884849664> ***${msg.language.get("MESSAGE_KICK_YOURSELF")}***`);
        if (user.id === this.client.user.id) return msg.reply(`<:penguError:435712890884849664> ***${msg.language.get("MESSAGE_KICK_PENGU")}***`);
        if (user.kickable === false) return msg.reply(`<:penguError:435712890884849664> ***${msg.language.get("MESSAGE_KICK_CANT")}***`);

        reason = reason.length > 0 ? `${reason.join(" ")}\nBanned By: ${msg.author.tag}` : `No reason specified. Kicked By: ${msg.author.tag}`;
        await user.kick(reason);

        const log = this.client.log("ban", msg.guild, `👞 **${member.tag}** (${member.id}) was \`kicked\` by **${msg.author.tag}** (${msg.author.id}) for \`${reason}\``);
        const loggingChannel = msg.guild.channels.get(msg.guild.configs.loggingChannel);
        if (log) loggingChannel.sendEmbed(log);

        return msg.sendMessage(`<:penguSuccess:435712876506775553> ***${member.tag} ${msg.language.get("MESSAGE_KICKED")}***`);
    }

    async init() {
        if (!this.client.gateways.guilds.schema.has("staff-admins")) {
            this.client.gateways.guilds.schema.add("staff-admins", { type: "User", array: true, configurable: false });
        }
        if (!this.client.gateways.guilds.schema.has("staff-mods")) {
            this.client.gateways.guilds.schema.add("staff-mods", { type: "User", array: true, configurable: false });
        }
        if (!this.client.gateways.guilds.schema.logs.has("kick")) {
            this.client.gateways.guilds.schema.logs.add("kick", { type: "boolean", default: false });
        }
    }

};
