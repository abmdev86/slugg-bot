require('dotenv').config();
const fs = require('fs');
const { prefix } = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFolders = fs.readdirSync('./commands');
/**
 * Iterates over the commands folder and subfolder looking the subfolder first then the files within ending with .js
 * it then iterates over the files and sets the command as the file within the subfolder matching the name and sets the command.
 */
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}

}

/**
 * Runs once and notifying that the bot is online.
 */
client.once('ready', () => {
	console.log('Slugg-Bot Logged on server');
});

client.on('message', (message) => {

	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLocaleLowerCase();
	if (!client.commands.has(commandName)) return;
	const command = client.commands.get(commandName);

	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('There was an issue trying to execute the command');
	}

});

client.login(process.env.BOT_TOKEN);