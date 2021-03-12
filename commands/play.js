const Discord = require('discord.js');
const ytdl = require('ytdl-core-discord');
const yts = require('yt-search');

exports.help = {
    name: 'play',
    description: 'play music'
};

const queue = new Map();

async function play(guild, song)
{
    const serverQueue = queue.get(guild.id);
    if(!song)
    {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection
        .play(await ytdl(song.url), { type: 'opus' })
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));

    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Now playing: **${song.title}**`);
}

exports.skip = (message) => {
    if(!message.member.voice.channel)
    {
        return message.channel.send(
            "You need to be in a voice channel to skip song!"
        );
    }

    const serverQueue = queue.get(message.guild.id);

    if(!serverQueue)
    {
        return message.channel.send("There is no song to skip.")
    }

    serverQueue.connection.dispatcher.end();
};

exports.stop = (message) => {
    if(!message.member.voice.channel)
    {
        return message.channel.send(
            "You need to be in a voice channel to skip song!"
        );
    }

    const serverQueue = queue.get(message.guild.id);

    if(!serverQueue)
    {
        return message.channel.send("There is no song to stop.")
    }

    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

exports.queue = (message) => {
    if(!message.member.voice.channel)
    {
        return message.channel.send(
            "You need to be in a voice channel to check queue!"
        );
    }

    const serverQueue = queue.get(message.guild.id);

    if(!serverQueue)
    {
        return message.channel.send("Queue is empty.")
    }

    var queueString = '';
    var i = 0;

    serverQueue.songs.forEach(song => {
        if(i > 0)
        {
            queueString += `${i}. \`${song.title}\`\n`;
        }
        else
        {
            queueString += `Now playing: **${song.title}**\n`;
            queueString += '--------------------------------------------------------------------------------------------\n'
        }
        i++;
    });

    const queueMessage = new Discord.MessageEmbed()
        .setColor('#990000')
        .setTitle('Queue')
        .setDescription(queueString);

    return message.channel.send(queueMessage);
}

exports.remove = (message, args) => {
    if(!message.member.voice.channel)
    {
        return message.channel.send(
            "You need to be in a voice channel to remove song from queue!"
        );
    }

    const serverQueue = queue.get(message.guild.id);

    if(!serverQueue)
    {
        return message.channel.send("Queue is empty.")
    }

    if(args[0] < serverQueue.songs.length && args[0] > 0)
    {
        var tempTitle = serverQueue.songs[args[0]].title;
        serverQueue.songs.splice(args[0], 1);
        return message.channel.send(
            `Removed song ${args[0]}. ${tempTitle}`
        );
    }
};

exports.run = async (bot, message, args) => {
    const voiceChannel = message.member.voice.channel;
    if(!voiceChannel)
    {
        return message.channel.send(
            "You need to be in a voice channel to play music!"
        );
    }
    
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK"))
    {
        return message.channel.send(
            "I need the permissions to join and speak in your voice channel!"
        );
    }

    const serverQueue = queue.get(message.guild.id);
    var song;

    if(ytdl.validateURL(args[0]))
    {
        const songInfo = await ytdl.getInfo(args[0]);
        song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
        };
    }
    else
    {
        const {videos} = await yts(args.slice(0).join(" "));
        if(!videos.length) return message.channel.send("Song not found!");
        song = {
            title: videos[0].title,
            url: videos[0].url,
        };
    }
    
    if(!serverQueue)
    {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };

        queue.set(message.guild.id, queueContruct);
        queueContruct.songs.push(song);

        try
        {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            play(message.guild, queueContruct.songs[0]);
        }
        catch(err)
        {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channer.send(err);
        }
    }
    else
    {
        serverQueue.songs.push(song);
        return message.channel.send(`${song.title} has been added to the queue!`);
    }
};