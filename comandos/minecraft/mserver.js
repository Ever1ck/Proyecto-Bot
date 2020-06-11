const Discord = require("discord.js");
const request = require("request");

module.exports = {
    nombre: "mserver",
    alias: [],
    descripcion: "Casos del covid-19 en el mundo",
    categoria: "Minecraft",
    run: async (client, message, args) => {
        let motd = `http://status.mclive.eu/MinecraftServer/${args}/25565/banner.png` //esta pagina se encarga de hacer una imagen con el motd del servidor al que estamos haciendo ping.
  
        let pingURL = `https://api.minetools.eu/ping/${args}` //esta herramienta nos hara poder obtener informaciÃ³n basica del servidor como los jugadores en linea o el motd(motd en texto.)
  
        request(pingURL, function(err, resp, body){
          if(err) return console.log(err.message);
          body = JSON.parse(body);
          if(body.error) return message.channel.send(":x: `Error | Servidor fuera de linea o no disponible.`") //Si el servidor no existe o esta fuera de linea/no disponible mandarÃ¡ este mensaje.
    
          let DescReplace = /Â§\w/g;
    
          const EBReedSing = new Discord.MessageEmbed()
          .setTitle('Minecraft Server')
          .setColor('RANDOM')
          .setImage(motd) //esto pondra como imagen al motd.
          .addField('Jugadores', body.players.online+'/'+body.players.max, true) //Esto nos mostrara los players online en el embed
    
//IMPORTANTE: el motd no se actualiza en tiempo real pero los players en linea si­.

         message.channel.send(EBReedSing); //mandamos el embed con la informacion.
         })
    }
}