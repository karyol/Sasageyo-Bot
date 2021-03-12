const Discord = require('discord.js');
const { serverQueue } = require('./play.js');

exports.help = {
    name: 'skip',
    description: 'skip to next song'
};

exports.run = async (bot, message, args) => {
    const command = bot.commands.get('play');
    command.skip(message);
};