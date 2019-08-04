/**
 * Bot made by : Iryu##8521
 * 
 * The core code is from : https://discordjs.guide/
 * Everything else was made by myself :)
 * 
 *
 */
require('dotenv').config();
const Discord = require("discord.js");
const fs = require("fs");
const {prefix, usage} = require("./settings.json");
const token = process.env.token;
const request = require('request');

const client = new Discord.Client();
const cooldowns = new Discord.Collection();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

client.once("ready", () => {
    console.log(`\n\n[HI !]############`);
    console.log(`[BOT]: Ready`);
});

client.on("message", async (message) => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if(!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing *${command.name}`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    if (args[0] === usage) {
        if(!command.usage) return message.reply("Sorry, Can't help you with that.");
        return message.channel.send(`${prefix}${command.name} **${command.usage}**`)
    }

    try {
        command.execute(message, args, request);
    }
    catch (e) {
        console.error(e);
        message.reply("Ho, quelque chose s'est mal passe :/ Si vous voyez ce message merci de me contacter (Iryu)");
    }
})

client.login(token);
