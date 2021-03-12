const Discord = require('discord.js');

exports.help = {
    name: 'disconnect',
    description: 'disconnect bot from voice channel'
};

exports.run = (bot, message, args) => {
    if(!message.guild.me.voice.channel)
    {
        return message.channel.send("I'm not on a voice channel");
    }
    message.guild.me.voice.channel.leave();
};