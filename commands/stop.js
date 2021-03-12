const Discord = require('discord.js');
const { serverQueue } = require('./play.js');

exports.help = {
    name: 'stop',
    description: 'stop music'
};

exports.run = async (bot, message, args) => {
    const command = bot.commands.get('play');
    command.stop(message);
};