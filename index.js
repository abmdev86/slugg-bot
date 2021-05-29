const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('client is ready!');
});

client.on('message', (message) => {
	if (message.content == '$Hello') {
		message.channel.send(`Hello ${message.author.username}`);
	}
});

client.login(process.env.BOT_TOKEN);