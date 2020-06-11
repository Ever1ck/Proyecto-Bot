const Discord = require("discord.js")

module.exports = {
    nombre: "avatar",
    alias: [],
    descripcion: "avatar del usuario",
    categoria: "Fun",
    run: (client, message, args) => {
        let user = message.mentions.users.first() || message.author//definimos lo que estamos buscando. Primero chequea si el usuario menciono a alguien sino elige al usuario que mando el mensaje
  
        const embed = new Discord.MessageEmbed()//creamos un embed
        .setDescription(`[Descargar Avatar](${user.displayAvatarURL()})`)//esto permite descargar la imagen del avatar
        .setImage(user.displayAvatarURL())// este es la imagen del avatar
        .setColor(Math.floor(Math.random() * 16777214) + 1)//el color del embed
        .setFooter(client.user.username, client.user.displayAvatarURL())//la linea al final en el embed
        message.channel.send({ embed: embed })//envia el embed.
    }
}