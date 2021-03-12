const Discord = require('discord.js');

exports.help = {
    name: 'p',
    description: 'play music'
};

exports.run = async (bot, message, args) => {
    const command = bot.commands.get('play');
    command.run(bot, message, args);
};