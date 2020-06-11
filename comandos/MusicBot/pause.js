const Discord = require("discord.js");
const ytdl = require('ytdl-core');
const search = require('youtube-search');
const queue = new Map();

module.exports = {
    nombre: "pause",
    alias: [],
    descripcion: "pausar la cancion",
    categoria: "MusicBot",
    run: async (client, message, args) => {
        const serverQueue = queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send('¡No hay canción!, la cola esta vacía.');
        if (!message.member.voice.channel) return message.channel.send('debes unirte a un canal de voz.');

         // Pausamos la canción en reproducción
         await serverQueue.connection.dispatcher.pause();
  
         message.channel.send(`Canción actual en pausa.`)
    }
}