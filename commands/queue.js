const Discord = require('discord.js');

exports.help = {
    name: 'queue',
    description: 'show queue'
};

exports.run = async (bot, message, args) => {
    const command = bot.commands.get('play');
    command.queue(message);
};