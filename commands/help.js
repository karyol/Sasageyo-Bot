const Discord = require('discord.js');
const fs = require('fs');
const { config } = require('../bot');
const play = require('./play.js');
const disconnect = require('./disconnect.js');
const skip = require('./skip.js');
const stop = require('./stop.js');

exports.help = {
    name: 'help',
    description: 'show help'
};

var comms = new Array();
var commsString = '';

/*fs.readdir('.', async (err, files) => {
    if(err) return console.error;
    files.forEach(file => {
        if(!file.endsWith('.js')) return;
        var props = require(`./${file}`);
        var cmdName = file.split('.')[0];
        comms.push({name: `${file.name}`, description: `${file.description}`});
        console.log(cmdName);
    });
});*/

comms.push(
    {name: `${this.help.name}`, description: `${this.help.description}`},
    {name: `${play.help.name}`, description: `${play.help.description}`},
    {name: `${skip.help.name}`, description: `${skip.help.description}`},
    {name: `${stop.help.name}`, description: `${stop.help.description}`},
    {name: `${disconnect.help.name}`, description: `${disconnect.help.description}`},
);

comms.forEach(obj => {
    commsString += config.prefix + obj.name + ' - ' + obj.description + '\n';
});

const helpMessage = new Discord.MessageEmbed()
    .setColor('#d83ecc')
    .setTitle('Help')
    .setDescription(commsString);

exports.run = (bot, message, args) => {
    message.channel.send(helpMessage).catch(console.error);
};