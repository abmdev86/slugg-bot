require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const prefix = '$';

const commandFiles = [{
	name: 'hello',
	description: ' Test command to see if the bot is taking commands and args',
	execute(message) {
		message.reply(`Hello ${message.author}`);
	},
}, {
	name: 'good',
	description: ' Say Hello to the bot',
	execute(message, args) {
		if (!args.length) {
			message.channel.send('Yes, Yes I am good, and I get better everyday....');
		}
		else if (args[0].toLowerCase() === 'bot') {
			message.reply(`Thank you ${message.author}`);

		}
	},
},
{
	name: 'server-info',
	description: 'Get information about the server',
	execute(message) {
		message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
	},
},
];

for (const cmd of commandFiles) {
	const command = cmd;
	client.commands.set(command.name, command);
}

client.once('ready', () => console.log('Slugg-Bot Logged on server'));

client.on('shardError', error => console.error(error));

client.on('guildMemberAdd', member => {
	const channel = member.guild.channels.cache.find(ch => ch.name === 'introductions');
	if (!channel) return;
	channel.send(`Yo ${member} welcome to SluggaVille, please take some time to introduce yourself, \n Job? \n Skill? \n Talent?, or hobbies.\n
	can be anything even just here to make friends and game. Welcome aboard but dont be a lurker or ghost`);
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