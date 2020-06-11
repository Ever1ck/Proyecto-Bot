const Discord = require('discord.js') //importamos dc.js
const Weez = require('weez'); //importamos weez
const request = require('node-superfetch');

module.exports = {
    nombre: "loli",
    alias: [],
    descripcion: "muestra lolis random",
    categoria: "Anime",
    run: async (client, message, args) => {

        var weez = new Weez.WeezAPI("tUSY2rc0qfEwlfp0LYaJWGYXEg4PRUmQofoJ")//acá pones tu token de weez
        let link = await weez.randomLoli() //obtenemos la imagen
        let embed = new Discord.MessageEmbed()
          .setImage(link)
          .setColor('RANDOM')
        message.channel.send(embed) //enviamos el embed
    }
}