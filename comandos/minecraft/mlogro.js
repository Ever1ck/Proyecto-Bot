const Discord = require('discord.js');
const request = require('request');
const fs = require('fs');


module.exports = {
    nombre: "mlogro",
    alias: [],
    descripcion: "Logro personalisado de Minecraft",
    categoria: "Minecraft",
    run: async (client, message, args) => {
        let achievement = args.join(" ");
         const iconos = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39"]; //Esto es para generar el item o imagen que va al lado izquierda del logro (para explicarme mejor, seria el logo de una Mesa de crafteo, un diamante, etc.)
         let result = Math.floor((Math.random() * iconos.length));
  
         function isEmpty(obj) {
           if (obj == null) return true;
           if (obj.length > 0)    return false;
           if (obj.length === 0)  return true;
           if (typeof obj !== "object") return true;
           for (var key in obj) {
           if (hasOwnProperty.call(obj, key)) return false;
           }
           return true;
         }

         if (isEmpty(achievement)) return message.channel.send("**Que lograste?** No ingresaste ningun argumento, prueba de nuevo."); //Esto especicamente es cuando no ingresa nada y pues debe ingresar algun valor :v

         var download = function(uri, filename, callback){
          request.head(uri, function(err, res, body){
            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
          });
         };
         var dir = `achievement.png`;
         var download = `https://www.minecraftskinstealer.com/achievement/a.php?i=${iconos[result]}&h=Logro%20Obtenido!&t=`+achievement, dir
          var embed = new Discord.MessageEmbed()
           .setColor("RANDOM")
           .setAuthor(`${message.author.tag}\nLogro Desbloqueado!`, message.author.displayAvatarURL())
           .setImage(download)
           .setFooter(message.guild.name, message.guild.iconURL())
           .setTimestamp()
           message.channel.send(embed);
    }
}