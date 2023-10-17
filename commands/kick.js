const Discord = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: `./json.sqlite` });
module.exports = {
    name: "kick",
    description: "Kicks a member from the server",

    async execute(client, message, args) {

        if (!message.member.permissions.has("KICK_MEMBERS")) return message.channel.send(' **You can not use this command | Permission: KICK_MEMBERS**');
        if (!message.member.permissions.has("KICK_MEMBERS")) return message.channel.send(' **I do not have the correct permissions | Permission : KICK_MEMBERS**');

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!args[0]) return message.channel.send(' **Please specify a user**');

        if (!member) return message.channel.send(' **User not found**');
        if (!member.kickable) return message.channel.send(' **I can not kick this user. Either because they are the mod / admin, or their role is higher than mine**');

        if (member.id === message.author.id) return message.channel.send('**You can not kick yourself -_-**');

        let reason = args.slice(1).join(" ");

        if (reason === undefined) reason = 'not defined';

        let userE = new Discord.MessageEmbed()
            .setTitle(`You've Been Kicked From **${ message.guild.name }**`)
            .addField('Mod', `**${ message.author }**`)
            .addField('Reason', `**${ reason }**`)
            .setTimestamp(new Date());

        member.send({ embeds: [userE] })
            .catch(() => message.reply("unable to send message"))
            .then(() => member.kick(reason))
            .catch(err => {
                if (err) return message.channel.send(err);
            });

        const kickembed = new Discord.MessageEmbed()
            .setTitle('User has been kicked')
            .setThumbnail(member.user.displayAvatarURL())
            .setColor(0x5D40F2)
            .addField('Username', `**${ member }**`)
            .addField('Kicked by', `**${ message.author }**`)
            .addField('Reason', `**${ reason }**`)
            .setFooter({ text: 'Kick time', iconURL: client.user.displayAvatarURL() })
            .setTimestamp();

        let mChannel = await db.get(`modlog_${ message.guild.id }`);
        if (!mChannel) return message.channel.send({ embeds: [kickembed] });
        let kickChannel = message.guild.channels.cache.get(mChannel);
        if (!kickChannel) return;
        kickChannel.send({ embeds: [kickembed] });


    }
};