module.exports = {
    nombre: "ping",
    alias: [],
    descripcion: "muestra el ping del usuario",
    categoria: "Fun",
    run: (client, message, args) => {
        return message.channel.send("api ms es de "+Math.floor(client.ping))
    }
}