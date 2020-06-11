const Discord = require("discord.js");
const ytdl = require('ytdl-core');
const search = require('youtube-search');
const queue = new Map();


module.exports = {
    nombre: "stop",
    alias: [],
    descripcion: "Detener toda la PlayList",
    categoria: "MusicBot",
    run: async (client, message, args) => {
        
        const serverQueue = queue.get(message.guild.id);
        if (!message.member.voice.channel) return message.channel.send('Debes unirte a un canal de voz para detener la canción.');
        if (!serverQueue) return message.channel.send('¡No hay canción!, la cola esta vacía.');
         // Aquí borramos la cola de las canciones agregadas
         serverQueue.songs = [];

        // Finalizamos el dispatcher
        await serverQueue.connection.dispatcher.end();
         message.channel.send('Lista de canciones fue detenida.')
    }
}