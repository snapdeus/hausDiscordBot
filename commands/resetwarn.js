
const Discord = require('discord.js');
const db = require('quick.db')


module.exports = {
    name: "resetwarns",
    description: "Reset warnings of mentioned person",
    execute: async (client, message, args) => {
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send('NO. **You can not use this command | Permission: ADMINISTRATOR**')
        if (!message.member.permissions.has("MANAGE_CHANNELS")) return message.channel.send('NO. **I do not have the correct permissions | Permission : MANAGE_CHANNELS**')

        const user = message.mentions.members.first();

        if (!user) {
            return message.channel.send("NO. **Please mention a user**");
        }

        if (message.mentions.users.first().bot) {
            return message.channel.send("NO. **Bot are not allowed to have warnings**");
        }

        if (message.author.id === user.id) {
            return message.channel.send("NO. **You are not allowed to reset your warnings**");
        }

        let warnings = db.get(`warnings_${ message.guild.id }_${ user.id }`);

        if (warnings === null) {
            return message.channel.send(`NO. **${ message.mentions.users.first().username } don\'t have any warnings**`);
        }

        db.delete(`warnings_${ message.guild.id }_${ user.id }`);
        const resetwarn = new Discord.MessageEmbed()
            .setTitle('Warnings Reseted')
            .setDescription(`OK. **Your warnings are reseted by ${ message.author.username } from ${ message.guild.name }**`)
            .setTimestamp()
            .setFooter({ text: `${ client.user.username }` })
            .setThumbnail(client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
        user.send(
            { embeds: [resetwarn] }
        );
        const resetwarn2 = new Discord.MessageEmbed()
            .setTitle('Warnings Reseted')
            .setDescription(`OK. **Reseted all warnings of ${ message.mentions.users.first().username }**`)
            .setTimestamp()
            .setFooter({ text: `${ client.user.username }` })
            .setThumbnail(client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
        await message.channel.send(
            { embeds: [resetwarn2] }
        );
    }
};