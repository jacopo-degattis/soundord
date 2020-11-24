const Discord = require('discord.js');
const client = new Discord.Client();
const scdl = require('soundcloud-downloader')
const fs = require('fs');
const url = 'https://soundcloud.com/taliya-jenkins/double-cheese-burger-hold-the'

const TOKEN = 'NzgwODUwNzU0NjQxNzIzNDEy.X71F7w.vHvQo2wu73-dowQco3iEONy7MPg'
const CLIENT_ID = 'bOhiQWwDrH6Yk5TC999Wa3yhnUtKhgOk'

let dj = null; // Current player variable

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
})

function validateUrl(uri) {
    // Esempio
    // https://soundcloud.com/pietro-grassini/daytona-kk-300-cavalli-prod
    const re = /^(https:\/\/soundcloud.com\/.*\/.*)/;
    return uri.match(re) ? true : false;
}

client.on('message', async (msg) => {
    const receivedMessage = msg.content;
    if (!receivedMessage.startsWith('!')) return;

    if (receivedMessage.startsWith('!play') && receivedMessage.split(' ').length == 2) {
        if (validateUrl(receivedMessage.split(' ')[1])) {
            const data = await scdl.getInfo(receivedMessage.split(' ')[1], CLIENT_ID)
            const duration = ((data.duration)/60000).toFixed(2).replace('.', ':')
            const embed = new Discord.MessageEmbed()
                            .setTitle("Requested to play")
                            .setDescription(`${data.title} - ${data.user.full_name}`)
                            .setAuthor(msg.author.username, msg.author.displayAvatarURL())
                            .setThumbnail(data.artwork_url)
                            .addFields(
                                { name: 'Song Duration', value: duration, inline: true },
                            )
            msg.reply(embed);
            const currVoiceChannel = msg.member.voice.channel;
            const connection = await currVoiceChannel.join()
            const stream = await scdl.download(receivedMessage.split(' ')[1], CLIENT_ID)
            dj = connection.play(stream);
        } else {
            console.log("Invalid uri")
        }
    } else if (receivedMessage.startsWith('!pause') && receivedMessage.split(' ').length == 1) {
        dj.pause();
        msg.reply("Song has been paused !")
    } else if (receivedMessage.startsWith('!resume') && receivedMessage.split(' ').length == 1) {
        dj.resume();
        msg.reply("Resuming track ! ");
    } else if (receivedMessage.startsWith('!quit') && receivedMessage.split(' ').length == 1) {
        currVoiceChannel.leave();
        msg.reply("Bye ! ");
    }
    else {
        console.log("errore");
    }
})

client.login(TOKEN);
