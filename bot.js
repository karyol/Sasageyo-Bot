const Discord = require('discord.js');
const fs = require('fs');
const Enmap = require('enmap');

const bot = new Discord.Client();

bot.commands = new Enmap();

const config = {
    token: 'ODE5ODg3Mzg0NTgwNTg3NTUx.YEtJoQ.hF50N8aVQgX1jGyCj4T9Uayrb98',//process.env.BOT_TOKEN,
    prefix: '%'//process.env.PREFIX
};

module.exports = { config };

fs.copyFile('./commands/help.js', './commands/h.js', (err) => {
    if (err) throw err;
});

fs.copyFile('./commands/play.js', './commands/p.js', (err) => {
    if (err) throw err;
});

fs.readdir('./events', async (err, files) => {
    if(err) return console.error;
    files.forEach(file => {
        if(!file.endsWith('.js')) return;
        var evt = require(`./events/${file}`);
        var evtName = file.split('.')[0];
        console.log(`Loaded '${evtName}'.`);
        bot.on(evtName, evt.bind(null, bot));
    });
});

fs.readdir('./commands', async (err, files) => {
    if(err) return console.error;
    files.forEach(file => {
        if(!file.endsWith('.js')) return;
        var props = require(`./commands/${file}`);
        var cmdName = file.split('.')[0];
        console.log(`Loaded command '${cmdName}'.`);
        bot.commands.set(cmdName, props);
    });
});

bot.login(config.token);