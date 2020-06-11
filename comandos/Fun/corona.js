const discord = require("discord.js")
const { NovelCovid } = require("novelcovid");
const track = new NovelCovid();

module.exports = {
    nombre: "corona",
    alias: [],
    descripcion: "Casos del covid-19 en el mundo",
    categoria: "Evento",
    run: async (client, message, args) => {
        if(!args.length) {
            return message.channel.send("Escriba el nombre de un Pais")
          }
      
          if(args.join(" ") === "all") {
            let corona = await track.all() //it will give global cases
      
            let embed = new discord.MessageEmbed()
            .setTitle("Casos a nivel Mundial 🌍")
            .setColor("#ff2050")
            .setDescription("Aveces el numero de casos suele diferir en menor cantidad.")
            .addField("Casos Totales", corona.cases, true)
            .addField("Muertes Totales", corona.deaths, true)
            .addField("Recuperados", corona.recovered, true)
            .addField("Casos de Hoy", corona.todayCases, true)
            .addField("Muertes de Hoy", corona.todayDeaths, true)
            .addField("Casos Activos", corona.active, true)
            .addField("Criticos", corona.critical, true);
      
            return message.channel.send(embed)
      
      
      
          } else {
            let corona = await track.countries(args.join(" ")) //change it to countries
      
            let embed = new discord.MessageEmbed()
            .setTitle(`${corona.country} 🗺`)
            .setColor("#ff2050")
            .setDescription("Aveces el numero de casos suele diferir en menor cantida.")
            .addField("Casos Totales", corona.cases, true)
            .addField("Muertes Totales", corona.deaths, true)
            .addField("Recuperados", corona.recovered, true)
            .addField("Casos de Hoy", corona.todayCases, true)
            .addField("Muertes de Hoy", corona.todayDeaths, true)
            .addField("Casos Activos", corona.active, true)
            .addField("Criticos", corona.critical, true);
      
            return message.channel.send(embed)
         }
    }
}