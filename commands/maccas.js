const Discord = require("discord.js")

module.exports = {
    name: "maccas",
    usage: "Big Maccas",

    // Execute contains content for the command
    async execute(client, message, args) {


        const embedMsg = new Discord.MessageEmbed().setColor("#0099ff")
            .setThumbnail("https://i.imgur.com/HqgLuMn.png")
            .setTitle("๐ฆ๐บ๐ฆ๐บ๐ฆ๐บ")
            .setColor("#fcbc7c")
            .setDescription("oi cunt hereโs ya big mac fatty๐๐๐")


        message.channel.send({ embeds: [embedMsg] });

    }
};