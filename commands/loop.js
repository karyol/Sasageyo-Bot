const Discord = require('discord.js');

exports.help = {
    name: 'loop',
    description: 'loops queue'
};

exports.run = async (bot, message, args) => {
    const command = bot.commands.get('play');
    command.loop(message);
};