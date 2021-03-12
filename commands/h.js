const Discord = require('discord.js');

exports.help = {
    name: 'h',
    description: 'show help'
};

exports.run = async (bot, message, args) => {
    const command = bot.commands.get('help');
    command.run(bot, message, args);
};