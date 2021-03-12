const Discord = require('discord.js');

exports.help = {
    name: 'd',
    description: 'disconnect bot from voice channel'
};

exports.run = async (bot, message, args) => {
    const command = bot.commands.get('disconnect');
    command.run(bot, message, args);
};