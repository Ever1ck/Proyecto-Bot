const Discord = require("discord.js")
const db = require("megadb");
const Dinero = new db.crearDB("Dinero");
let cooldown= new Set();

module.exports = {
    nombre: "work",
    alias: [],
    descripcion: "trabajo del usuario",
    categoria: "Fun",
    run: async (client, message, args) => {
        if(cooldown.has(message.author.id)) return message.channel.send("Debes esperar **5 Minutos** para usar este comando")
            const user = message.author;
            let trabajo = ["Camionero",  //Pueden agregar mas trabajos
                "Carpintero",
                "Policia",
                "Ladron",
                "Vendedor de Pizza",
                "Steamer",
                "Panadero",
                "Herrero",
            ];
            let tra = trabajo[Math.floor(trabajo.length * Math.random())];
            const tr = new Discord.MessageEmbed()
            .setTitle("Estas trabajando Ahora")
            .setDescription("¡Espera unos momentos, estas trabajando!")
            .setColor("RANDOM");
            message.channel.send(tr)
            .then(async m => {
                  setTimeout(() => {
                  Math.floor(Math.random() * (1001 - 100)) + 100   
            let random = Math.floor(Math.random() * (1001 - 100)) + 100   
                 setTimeout(() => {
                 m.delete()
                 }, 1000);
             if (!Dinero.tiene(`${user.id}`)) {
                Dinero.establecer(`${user.id}`, 0);}
          
                Dinero.sumar(`${user.id}`, random);
            const embed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTitle("¡Adivina quien ha trabajado, pues! :**" + user.username + "**")
                .addField("**Trabajaste** de:", "**" + tra + "**")
                .addField("**Dinero ganado:**", "``"+random+"``")
    
             m.channel.send(embed);
                    }, 10000); 
      
             cooldown.add(message.author.id)
              setTimeout(function(){
               cooldown.delete(message.author.id)
              }, 50000)  //5 Minutos (En Milesimas)
         });
    }
}