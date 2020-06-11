const Discord = require("discord.js")
const db = require("megadb");
let cantidad = new db.crearDB("Dinero") 

module.exports = {
    nombre: "balance",
    alias: ["money"],
    descripcion: "balance del usuario",
    categoria: "Fun",
    run: async (client, message, args) => {
        const user = message.mentions.users.first() || message.author;
    
         if(!cantidad.tiene(`${message.author.id}`)) {
      
      
           const embed = new Discord.MessageEmbed()
          .setColor("39FF14")
          .setTitle("Dinero de: **" + user.username + "**")
          .addField("**Dinero:**", "``Sin Dinero``")
      

         message.channel.send(embed);
         }else {
              let dinero = await cantidad.obtener(`${user.id}`);  
       
          const embed2 = new Discord.MessageEmbed()
          .setColor(Math.floor(Math.random() * 16777214) + 1)
          .setTitle("Dinero de: **" + user.username + "**")
          .addField("**Dinero:**", "``"+dinero+"``") 
      
          message.channel.send(embed2)
         }
    }
}