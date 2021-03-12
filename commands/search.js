const Discord = require('discord.js');
const search = require('yt-search');

exports.help = {
    name: 'search',
    description: 'search for a song on youtube'
};

exports.run = (bot, message, args) => {
    if(!message.member.voice.channel)
    {
        return message.channel.send(
            "You need to be in a voice channel to search for a song!"
        );
    }

    search(args.join(' '), (err, res) => {
        if (err) return message.channel.send('Something went wrong.');

        var videos = res.videos.slice(0, 10);
        var resp = '';

        for(var i in videos)
        {
            resp += `**[${parseInt(i) + 1}]:** \`${videos[i].title}\`\n`;
        }

        resp += `\n**Choose a number beetween** \`1-${videos.length}\``;

        const respMessage = new Discord.MessageEmbed()
            .setColor('#3d0099')
            .setDescription(resp);

        message.channel.send(respMessage);

        const filter = m => !isNaN(m.content) && m.content < videos.length + 1 && m.content > 0;
        const collector = message.channel.createMessageCollector(filter);
        collector.videos = videos;

        collector.once('collect', function(m) {
            const command = bot.commands.get('play');
            command.run(bot, message, [this.videos[parseInt(m.content) - 1].url]);
        });
    });
};