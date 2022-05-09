const Discord = require('discord.js')

module.exports = {
    name: 'help',
    description: 'bot commands',

    async execute(message, args) {
        const embedMsg = new Discord.MessageEmbed()
            .setColor('#dd99ff')
            .setTitle('Bot Docs')
            .setDescription('Here are the commands:')
            .addField("Total number of Gay Comics", "!totalcomics")
            .addField("Post a gay comic", "!comic <number>")
            .addField("Total number of podcast episodes", "!totalepisodes")
            .addField("Post a podcast episode", "!episode <number>")
            .addField("Let hausBot jack off", '!jackoff')
            .addField('Ask Magic Gay 8Ball a question', '!8ball')
            .addField('Obamna/SODA', 'Obamna [or] SODA')


        message.author.send({ embeds: [embedMsg] });

    }
}