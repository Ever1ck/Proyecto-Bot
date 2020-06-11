module.exports = {
    nombre: "roll",
    alias: [],
    descripcion: "roll ramdon o elegir un numero",
    categoria: "Fun",
    run: (client, message, args) => {
        let roll = message.content.split(' ').slice(1);
        if(roll < 0) return message.reply(`escriba un número entre 1 y 100!`);
        if(roll > 100) return message.reply(`escriba un número entre 1 y 100!`);
    
        let randomroll  = Math.floor(Math.random() * roll) + 1;
        let random = Math.floor(Math.random() * 100) + 1;
    
        if(!roll[0]){
         message.channel.send(`${message.author.username}`+' Del 1 al 100 la maquina saco: '+random)
    
        }else{
          message.channel.send(`${message.author.username}`+' Del 1 al '+roll+' la maquina saco: '+randomroll)
    
        }
    }
}