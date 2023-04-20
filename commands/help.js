const Discord = require('discord.js');





module.exports = {
    name: 'help',
    description: 'bot commands',

    async execute(client, message, args) {
        const embedMsg = new Discord.MessageEmbed()
            .setColor('#dd99ff')
            .setTitle('Bot Docs')
            .setDescription('Here are the commands:')
            .addField("Send the admins a report.", "!report")
            .addField("See if you have warnings", "!warnings <@username>")
            .addField("Gay Comics", "!totalcomics and !comic <number>")
            .addField("Podcast", "!totalepisodes and !episode <number>")
            .addField("hausBot commands:", '!jackoff, !8ball, !phrase, !snipe')
            .addField('Dice games', '/roll and /shipcc')
            .addField('XP and Leaderboard', '/rank and /leaders')
            .addField('Shopping Bag', '/getcash /bag, /bread, /dairy, /pasta, /soup')
            .addField('Crime and Punishment', '/steal, /arrest - If you steal, you may go to Jail!')
            .addField('AI-Chat', 'use the command !chat to talk with hausBot powered by chatGPT.\n hausBot stores what you say in a database for persistent memory.')
            .addField('Image generation', '!image and !vary (vary requires attached image))\n !imagesd for stable diffusion')
            .addField('Misc', '!pw - get an archive.is link of a provided URL');

        console.log('HELP MESSAGE SENT');
        message.author.send({ embeds: [embedMsg] });


    }
};