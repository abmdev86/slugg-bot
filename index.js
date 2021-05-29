require('dotenv').config();
const fs = require('fs');
// const { prefix } = require('./config.json');
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

	if (!message.content.startsWith('$') || message.author.bot) return;
	if (message.content === '$Hello') {
		message.reply(`Hello ${message.author}`);
	}

	const args = message.content.slice('$'.length).trim().split(/ +/);
	const commandName = args.shift().toLocaleLowerCase();

	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases.includes(commandName));

	if (!client.commands.has(commandName)) return;

	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply('cant execute this in the DM');
	}
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${'$'}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}
	const { cooldowns } = client;

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
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('There was an issue trying to execute the command');
	}

});

client.login(process.env.BOT_TOKEN);