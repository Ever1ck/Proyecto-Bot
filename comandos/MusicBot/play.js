const Discord = require("discord.js");
const ytdl = require('ytdl-core');
const search = require('youtube-search');
const queue = new Map();
const client = new Discord.Client({ disableEveryone: true});

module.exports = {
    nombre: "play",
    alias: [],
    descripcion: "Busca y reproduce una musica",
    categoria: "MusicBot",
    run: async (client, message, args) => {
        const serverQueue = queue.get(message.guild.id);

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send('¡Necesitas unirte a un canal de voz!');
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
            return message.channel.send('¡Necesito permisos para unirme y hablar en el canal de voz!');
        }
        var opts = {
            maxResults: 1, //Maximo de resultados a encontrar
            key: 'YT_API_KEY', //Necesitas una CLAVE de la API de youtube.
            type: "video" // Que tipo de resultado a obtener.
        };
        const songArg = await search(args.join(' '), opts);
        const songURL = songArg.results[0].link;
        const songInfo = await ytdl.getInfo(songURL);

        const song = {
            title: songInfo.title,
            url: songInfo.video_url,
            author: message.author.tag
        };
        if (!serverQueue) {
            const queueObject = {
                textChannel: message.channel, //guardamos el canal de texto
                voiceChannel: voiceChannel, // guardamos el canal de voz
                connection: null, // un objeto para la conexión 
                songs: [], // creamos la lista de canciones
                volume: 5, // volumen al iniciar la cola
                playing: true, // un objeto para validar la cola de música en reproducción.
            };
            queue.set(message.guild.id, queueObject);

            queueObject.songs.push(song);

            try {
                // Aquí unimos el bot al canal de voz y guardar nuestra conexión en nuestro objeto.
                var connection = await voiceChannel.join();
                queueObject.connection = connection;
               
                message.channel.send(`Reproduciendo ahora: **${song.title}**`);
               
                // Llamar a la función de reproducción para comenzar una canción.
                play(message.guild, queueObject.songs[0]);
               
               } catch (err) {
               
                // Imprimir el mensaje de error si el bot no puede unirse al chat de voz
                console.log(err);
                queue.delete(message.guild.id);
                return message.channel.send(err);
               
               }
        }else {
            serverQueue.songs.push(song);
            console.log(serverQueue.songs);
            return message.channel.send(`**${song.title}** ha sido añadido a la cola!, __por: ${message.author.tag}__`);

        }
    }
}
function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    // verificamos que hay musica en nuestro objeto de lista
    if (!song) {
     serverQueue.voiceChannel.leave(); // si no hay mas música en la cola, desconectamos nuestro bot
     queue.delete(guild.id);
     return;
    }
    // <-- Reproduccion usando play() -->
    const dispatcher = serverQueue.connection.play(ytdl(song.url))
 .on('finish', () => {
   // Elimina la canción terminada de la cola.
   serverQueue.songs.shift();

   // Llama a la función de reproducción nuevamente con la siguiente canción
   play(guild, serverQueue.songs[0]);
 })
 .on('error', error => {
  console.error(error);
 });

 // Configuramos el volumen de la reproducción de la canción
 dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  }
