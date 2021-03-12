const { config } = require('../bot.js');

module.exports = async (bot, message) => {
    if(message.content.substr(0, config.prefix.length) == config.prefix)
    {
        if(message.author.bot) return;
        if(message.content.indexOf(config.prefix) !== 0) return;

        var args = message.content.substr(config.prefix.length).split(/ +/g);
        var cmd = args[0].toLowerCase();

        const command = bot.commands.get(cmd);
        if(!command) 
        {
            message.channel.send('If you need help type "' + config.prefix + 'help"');
            return;
        }

        args = args.splice(1);

        command.run(bot, message, args);
    }
};