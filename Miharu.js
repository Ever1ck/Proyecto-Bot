const Discord = require("discord.js");
const client = new Discord.Client({ disableEveryone: true});
const db = require("megadb");
const fs = require("fs");
const { join } = require("path");
const { token, prefix } = require('./config.json');

const ytdl = require('ytdl-core');
const search = require('youtube-search');
const queue = new Map();

//Comando Handler
client.comandos = new Discord.Collection()
fs.readdirSync("./comandos/").map(dir => {
let archivos = fs.readdirSync(`./comandos/${dir}/`).filter((f) => f.endsWith(".js"))
for(var archi of archivos) {
  let comando = require(`./comandos/${dir}/`+archi)
  client.comandos.set(comando.nombre, comando)
  console.log(archi+" fue cargado correctamente")
}});
//Aqui acaba el handler

//Mostrar en la consola si el bot esta Listo y el estado del bot
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
  }, 60000);
	console.log(client.user.presence.status);
});
client.on("message", async (message) => {
if (message.author.bot) return;
if (message.channel.type == "dem") return;
if (!message.content.startsWith(prefix)) return;

const args = message.content.slice(prefix.length).trim().split(/ +/g);
const command = args.shift().toLowerCase();

let cmd = client.comandos.get(command) || client.comandos.find((c) => c.alias.includes(command))
if(cmd) {
  return cmd.run(client, message, args)
}

});
// NO Hacer Nada aqui
client.login(token)