const Discord = require('discord.js');
const ytdl = require('ytdl-core-discord');

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

    const songInfo = await ytdl.getInfo(args[0]);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
    };

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
        console.log(serverQueue.songs);
        return message.channel.send(`${song.title} has been added to the queue!`);
    }
};