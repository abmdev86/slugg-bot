module.exports = {
	name: 'user-info',
	description: 'Display Info about yourself',
	args: false,
	execute(message) {
		message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
	},
};