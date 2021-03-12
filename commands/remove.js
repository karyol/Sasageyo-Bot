const Discord = require('discord.js');

exports.help = {
    name: 'remove',
    description: 'remove song from queue'
};

exports.run = async (bot, message, args) => {
    const command = bot.commands.get('play');
    command.remove(message, args);
};