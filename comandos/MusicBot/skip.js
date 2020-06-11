const Discord = require("discord.js");
const ytdl = require('ytdl-core');
const search = require('youtube-search');
const queue = new Map();

module.exports = {
    nombre: "skip",
    alias: [],
    descripcion: "Saltar a la siguiente cancion",
    categoria: "MusicBot",
    run: async (client, message, args) => {
        const serverQueue = queue.get(message.guild.id);
        if (!message.member.voice.channel) return message.channel.send('debes unirte a un canal de voz.');
        // Aquí verificamos si el objeto de la lista de canciones esta vacía.
        if (!serverQueue) return message.channel.send('¡No hay canción que saltar!, la cola esta vacía');

         // Finalizamos el dispatcher
         await serverQueue.connection.dispatcher.destroy();
         message.channel.send(`Reproduciendo ahora: **${serverQueue.songs[1].title}**`);
    }
}