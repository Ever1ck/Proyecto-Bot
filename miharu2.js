const Discord = require("discord.js");
const client = new Discord.Client();
const {
	prefix,
	token,
} = require('./config.json');

const ytdl = require('ytdl-core');
const search = require('youtube-search');
const queue = new Map();

client.on('ready', () => {
  console.log(`${client.user.tag} esta preparado`);
  setInterval(function() {
    var estados = ["NieRAutomata™", "Soy"+client.user.tag, "Minecraft"]
    let estado = estados[Math.floor(estados.length * Math.random())];
    client.user.setPresence({
      status: "online",
      activity: {
        name: estado,
        type: "PLAYING",
      }
    })
// Estos números son los milisegundos de los que les hable más arriba
  }, 60000);
	console.log(client.user.presence.status);

});

//A partir de aqui musica

//que entre el Bot

client.on("message", async (message) => {

	if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
    if(command === 'join'){
      let canalvoz = message.member.voice.channel;
      if(!canalvoz || canalvoz.type !== 'voice') {
          Message.channel.send('!Necesitas unirte a un canal de voz primero.');

      }else if (message.guild.voiceConnection) {
          message.channel.send('Ya estoy conectado en un canal de voz.');

      }else {
          message.channel.send('Conectando...').then(m => {
              canalvoz.join().then(() => {
                  m.edit('Conectado Exitosamente.').catch(error => console-log(error));

              }).catch(error => console.log(error));
          }).catch(error => console.log(error));
      };
  };
});
// que salga el Bot
client.on("message", async (message) => {
	if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
    if(command === 'leave'){
      let canalvoz = message.member.voice.channel;
      if(!canalvoz) {
        message.channel.send('No estas conectado a un canal de voz.');
    
      } else {
        message.channel.send('Dejando el canal de voz.').then(() => {
            canalvoz.leave();
    
        }).catch(error => console.log(error));
      } 
    };
});
//comandos del bot
client.on('message', async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  // Esta constate 'serverQueue' nos permitira saber si un servidor tiene una lista de musica reproduciendo.
  const serverQueue = queue.get(message.guild.id);

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const comand =args.shift().toLowerCase();

  // <-- CODIGO CMD PLAY (REPRODUCIENDO): -->

  if(comand === 'play') {
    const voiceChannel = message.member.voice.channel;

  //verificamos que el usuario solicitante este conectado a un canal de voz.
    if (!voiceChannel) return message.channel.send('¡Necesitas unirte a un canal de voz para reproducir música!');

    const permissions =voiceChannel.permissionsFor(message.client.user);

    //Verificamos que el Bot tenga permisos de conectarse y hablar en el servidor.
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
      return message.channel.send('¡Necesitos permisos para conectarme y hablar en el canal de voz!');
    }
  // <-- Capturamos la informacion de la Musica a Reproducir -->

  var opts = {
    maxResults: 1, //Maximo de resultados a encontrar
    key: 'AIzaSyBHkOoOvRQ6C5TG42ySPLzJKOoYLXmttu0', //NEcesitas una CLAVe de la API de Youtube.
    type: "Video" // Que tipo de resultado a obtener.
  };

  const songArg = await search(args.join(' '), opts);
  const songURL = songArg.results[0].link;
  const songInfo = await ytdl.getInfo(songURL);

  const song = {
    title: songInfo.title,
    url: songInfo.video_url,
    author: message.author.tag
  };

  // <-- Verificamos la lista de canciones de un servidor -->
  if (!serverQueue) {
    // Si NO hay una lista de musica.
    // <-- Creamos nuestra cola de musica a reproducir -->
  }else {
    // Si HAY una lista de musica reproduciendo
    serverQueue.song.push(song);
    console.log(serverQueue.songs);
    return message.channel.send(`**${song.title}** ha sido añadido a la cola!, __por: ${message.author.tag}__`);
  }
  // <-- Creamos nuestra cola de musica a reproducir -->
  // Creamos el conjunto de datos para nuestra cola de musica.
  const queueObject = {
    textChannel: message.channel, //guardamos el canal de texto
    voiceChannel: voiceChannel, // guardamos el canal de voz
    conection: null, // un objeto para la conexion
    songs: [], // creamos la lista de canciones
    volume: 7, // volumen al iniciar la cola
    playing: true, // un objeto para validad la cola de musica en reproduccion.
  };
  // <-- Establecer la cola de Musica -->
  // Creamos El conjunbto de datos para nuestra cola de Musica.
  queue.set(message.guild.id, queueObject);
  //Agregamos las canciones al conjunto de datos
  queueObject.songs.push(song);
  // <-- Conectar al canal de voz -->
  try {
    var conection = await voiceChannel.join();
    queueObject.conection = conection;

    message.channel.send('Reproduciendo: `**${song.title}**`');
    // Llamar a la funcion de reproduccion para comenzar una cancion.
    play(message.guild, queueObject.songs[0]);

  } catch (err) {
    // Imprimir el mensaje de error si el bot no puede unirse al canal de voz
    console.log(err);
    queue.delete(message.guild.id);
    return message.channel.send(err);
  }
  }

  // <-- CODIGO CMD SKYP (SALTAR): -->
  if(comand === 'skip') {
    // Aqui verificamos si el usuario que escribio el comando esta en un canal de voz y si hay una cancion a omitir.
   if (!message.member.voice.channel) return message.channel.send('Debes unirte a un canal de voz.');
   // Aqui verificamos si el objeto de la lista de cancion esta vacia.
   if (!serverQueue) return message.channel.send('¡No hay canción que saltar!, la cola esta vacía');
   // Finalizamos el dispatcher
   await serverQueue.conection.dispatcher.destroy();
   message.channel.send('Reproducioendo: `**${serverQueue.songs[1].title}**`')
}

  // <-- CODIGO CMD STOP (DETENER): -->
  if(comand === 'stop') {
    if (!message.member.voice.channel) return message.channel.send('Debes unirte a un canal de voz para detener la canción.');
    if (!serverQueue) return message.channel.send('¡No hay cancion!, la cola esta vacia.');
    // Aqui borramos la cola de las canciones agregadas 
    serverQueue.songs =[];

    // Finalizamos el dispatcher
    await serverQueue.conection.dispatcher.end();
    message.channel.send('Lista de canciones fue detenida')
  }

  // <-- CODIGO CMD VOLUMEN (VOLUMEN): -->
  if(comand === 'volumen') {
    // Validamos si la cola esta vacia
    if (!serverQueue) return message.channel.send('¡No hay canción!, la cola esta vacía.');
    if(!args.join(' ')) return message.channel.send('Agrege el volumen entre **1 a 100%**')
    // Creamos una variable para el porcentaje del volumen
    let countVolumen = parseInt(args[0]);

    if (countVolumen < 100) {
      let dispatcher = serverQueue.conection.dispatcher;

      // Modificamos el volumen de la cancion en reproduccion
      await dispatcher.setVolumen(Math.min((dispatcher.volume = countVolumen / 50)))

      message.channel.send(`**Volume:** \`${Math.round(dispatcher.volume*70)}\`**%**`)
    } else {
      message.channel.send('El volumen debe estar entre **1 a 100**')
    }
  }

  // <-- CODIGO CMD PAUSE (PAUSAR): -->
  if(comand === 'pause') {
    //validamos si la cola esta vacia
    if (!serverQueue) return message.channel.send('¡No hay canción!, la cola esta vacía.');
    if (!message.member.voice.channel) return message.channel.send('debes unirte a un canal de voz.');

    // Pausamos la cancion en reproduccion
    await serverQueue.conection.dispatcher.pause();

    message.channel.send('Cancion atual en pausa.')
  }
  
  // <-- CODIGO CMD RESUME (REANUDAR): -->
  if(comand === 'resume') {
    // Validamos si la cola esta vacia
    if (!serverQueue) return message.channel.send('¡No hay canción!, la cola esta vacía.');

    if (!message.member.voice.channel) return message.channel.send('debes unirte a un canal de voz.');

    // Reanudamos la cancion pausada

    message.channel.send(`Canción actual reanudada.`)
  }

  // <-- CODIGO CMD QUEUE (COLA): -->
  if(comand === 'queue') {
    if (!serverQueue) return message.channel.send('¡No hay canción que mostrar!, la cola esta vacía');
    let i = 1

    // Listamos las canciones de la cola
    let list = serverQueue.songs.slice(1).map((m) => {
      if(i > 16) return // Lista solo 15 canciones 
      i++;
      return `[${i}] - 🎵 ${m.title}  / 👤 por: ${m.author}` // Construimos la info de la canciones

    }).join('\n')

  let hr = "---------------------------------------------"
  // El tiempo de reproduccion de la cancion
  let time = Math.trunc(serverQueue.conection.dispatcher.streamTime / 100)

  // Agregamos la cancion actual reproduciendo 
  let playName = `${hr}\n🔊 Ahora: ${serverQueue.songs[0].title}\n🕐 Tiempo: ${time} segundos.\n👤 Por: ${serverQueue.songs[0].author}\n${hr}`
  // La cantidad de canciones encontradas
  let countSong = `\n${hr}\n📒 Lista ${serverQueue.songs.length}/15 canciones.`

  message.channel.send('```xl\n[LISTA DE CANCIONES PARA: '+message.guild.name.toUpperCase()+']\n'+playName+'\n\n'+ list +'\n'+countSong+'\n```')
  }

})

client.login(token);

// <-- FUNCION PLAY (REPRODUCIR): -->
function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  // verificamos que hay musica en nuestro objeto de lista
  if (!song) {
    serverQueue.voiceChannel.leave(); //si no hay mas musica en la cola, desconectamos el bot
    queue.delete(guild.id);
    return;
  }
  // <-- Reproduccion usando play() -->
  const dispatcher = serverQueue.conection.play(ytdl(song.url))
  .on('finish',() => {
    //Elimina la cancion terminada de la cola
    serverQueue.songs.shift();
    // Llama a la funcion de reproduccion nuevamente co la siguiente cancion
    play(guild, serverQueue.songs[0]);
  })
  .on('error', error => {
    console.error(error);
  });
  // Configuramos el volumen de la musica de la cancion
  dispatcher.setVolumeLogarithmic(serverQueue.volume/ 7);
}

//----------------------------Intenta otras cosas------------------------------------------------

//avatar

client.on("message", async (message) => {

  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
    if(command === 'avatar'){
      
    let user = message.mentions.users.first() || message.author//definimos lo que estamos buscando. Primero chequea si el usuario menciono a alguien sino elige al usuario que mando el mensaje
  
      const embed = new Discord.RichEmbed()//creamos un embed
      .setDescription(`[Descargar Avatar](${user.avatarURL})`).//esto permite descargar la imagen del avatar
      setImage(user.avatarURL)// este es la imagen del avatar
      .setColor(0xee8824)//el color del embed
      .setFooter(client.user.username, client.user.avatarURL)//la linea al final en el embed
      message.channel.send(embed)//envia el embed.
}
});

//comando Coronavirus
client.on("message", async (message) => {

if (message.author.bot) return;
if (!message.content.startsWith(prefix)) return;
const args = message.content.slice(prefix.length).trim().split(/ +/g);
const command = args.shift().toLowerCase();
  if(command === 'covid'){
    try{
    let res = await require('node-fetch')(`https://corona.lmao.ninja/v2/all?yesterday=false`);
    let data = await res.json();
    let covid = new Discord.MessageEmbed()
    .setTitle('Covid-19') 
    .addField('Casos', data.cases.toLocaleString(), true) // Obtenemos la cantidad de casos de COVID-19
    .addField('Casos hoy', data.todayCases.toLocaleString(), true) // Obtenemos la cantidad de casos de COVID-19 nuevos hoy
    .addField('Muertes', data.deaths.toLocaleString(), true) // Obtenemos la cantidad de muertes por COVID-19
    .addField('Muertes hoy', data.todayDeaths.toLocaleString(), true) // Obtenemos la cantidad de muertes por COVID-19 hoy
    .addField('Condición critica', data.critical.toLocaleString(), true) // Obtenemos la cantidad de gente en Condición critica
    .addField('Recuperados', data.recovered.toLocaleString(), true) // Obtenemos la cantidad de gente que se ha recuperado
    .setColor('FF0000')
    message.channel.send(covid)
}catch(e){
message.channel.send('Ha ocurrido un error!') // De repente se cae la API, con este try catch evitaremos un error en caso de que se haya caído 
}
}
});

client.on("message", async (message) => {

  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
    if(command === 'rol'){
      if(!message.guild.me.hasPermission("MANAGE_ROLES")) {
        return message.channel.send("No tengo permisos")
      }
      
      if(!message.member.hasPermission("MANAGE_ROLES")){
        return message.channel.send("Perdon, pero no tienes permisos")
      }
      
      let persona = message.mentions.members.first()
      if(!persona) return message.channel.send('Debe mencionar a alguien para darle el rol')
      
      let nombrerol = args.slice(1).join(' ')
      if(!nombrerol) return message.channel.send('Escriba el nombre del rol a agregar')
      
      let rol = message.guild.roles.cache.find(r => r.name == nombrerol)
      
      if(!rol){
        return message.channel.send('Rol no encontrado en el servidor')
        
      }else if(!rol.editable){
        return message.channel.send("Lo siento, pero no puedo darle ese rol a nadie, debido a que esta mas alto que mi rol")
        
      }else if(rol.comparePositionTo(message.member.highestRole) > 0){
        return message.channel.send("Ese rol es mas alto que tu rol mas alto (en lo que a jerarquia se refiere), asi no puedes darselo a nadie")
        
      }
      
      persona.roles.add(rol.id).catch(e => message.reply("Ocurrio un **error**"))
      message.channel.send(`Listo, le agrege el rol **${rol.name}** a **${persona.user.username}**`)
    }
  });