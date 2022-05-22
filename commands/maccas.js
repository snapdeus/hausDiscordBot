const Discord = require("discord.js")

module.exports = {
    name: "maccas",
    usage: "Big Maccas",

    // Execute contains content for the command
    async execute(client, message, args) {


        const embedMsg = new Discord.MessageEmbed().setColor("#0099ff")
            .setThumbnail("https://i.imgur.com/HqgLuMn.png")
            .setTitle("🇦🇺🇦🇺🇦🇺")
            .setColor("#fcbc7c")
            .setDescription("oi cunt here’s ya big mac fatty🍔🍔🍔")


        message.channel.send({ embeds: [embedMsg] });

    }
};