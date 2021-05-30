require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const prefix = '$';

const commands = [{
	name: 'hello', description: ' Say Hello to the bot', execute(msg) {
		msg.reply(`Hello ${msg.author}`);
	},
},
{ name: 'server-info', description: 'Get information about the server' },
];

for (const cmd of commands) {
	client.commands.set(cmd.name, commands);
}

client.once('ready', () => {
	console.log('Slugg-Bot Logged on server');
});

client.on('message', (message) => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;
	try {
		client.commands.get(command).execute(message, args);
	}
	catch(error) {
		console.error(error);
		message.reply('There was an error trying to run that command');
	}

});

client.login(process.env.BOT_TOKEN);