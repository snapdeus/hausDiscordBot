
const Discord = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: `./json.sqlite` });

module.exports = {
    name: "warnings",
    description: "Get the warnings of yours or mentioned person",
    execute: async (client, message, args) => {
        const user = message.mentions.members.first() || message.author;

        let warnings = await db.get(`warnings_${ message.guild.id }_${ user.id }`);

        if (warnings === null) warnings = 0;
        console.log(warnings);
        const warningsem = new Discord.MessageEmbed()
            .setTitle('Warnings')
            .setDescription(`**${ user } has __${ warnings }__ warning(s)**`)
            .setFooter({ text: `${ client.user.username }` })
            .setThumbnail(client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }));

        message.channel.send({ embeds: [warningsem] });
    }
};