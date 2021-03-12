const Discord = require('discord.js');

exports.help = {
    name: 'randomize',
    description: 'randomize queue'
};

exports.run = async (bot, message, args) => {
    const command = bot.commands.get('play');
    command.randomize(message);
};