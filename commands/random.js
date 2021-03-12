const Discord = require('discord.js');

exports.help = {
    name: 'random',
    description: 'every next song will be random'
};

exports.run = async (bot, message, args) => {
    const command = bot.commands.get('play');
    command.random(message);
};