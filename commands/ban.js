const Discord = require('discord.js');
const db = require('quick.db')

module.exports = {
    name: "ban",
    description: "Ban a member from the server",

    async execute(client, message, args) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!member) return message.channel.send(`**Please Mention A User**`);
        if (member.id === message.author.id) return message.channel.send('**You can not ban yourself -_-**');

        if (!member) return message.channel.send('NO. **User not found**');

        let reason = args.join(" ").slice(22);
        if (!reason) reason = "No Reason Specified";

        if (!message.member.permissions.has("BAN_MEMBERS")) return message.channel.send('NO. **You can not use this command | Permission: BAN_MEMBERS**')
        if (!message.member.permissions.has("BAN_MEMBERS")) return message.channel.send('NO. **I do not have the correct permissions | Permission : BAN_MEMBERS**')



        let e = new Discord.MessageEmbed()
            .setTitle('User has been banned')
            .addField('Username', `**${ member }**`)
            .addField('Banned by', `**${ message.author }**`)
            .addField('Reason', `**${ reason }**`)
            .setFooter({ text: 'Ban time' })
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp()


        let userE = new Discord.MessageEmbed()
            .setTitle(`You've Been Banned From **${ message.guild.name }**`)
            .addField('Mod', `**${ message.author }**`)
            .addField('Reason', `**${ reason }**`)
            .setTimestamp(new Date())

        member.send({ embeds: [userE] })
            .catch(() => message.reply("unable to send message"))
            .then(() => message.guild.members.cache.get(member.id).ban({ reason: reason }))
            .catch(err => {
                message.reply('I was unable to ban the member');
                console.error(err);
            })



        let mChannel = db.fetch(`modlog_${ message.guild.id }`)
        if (!mChannel) return message.channel.send(e)
        let banChannel = message.guild.channels.cache.get(mChannel)
        if (!banChannel) return;
        banChannel.send({ embeds: [e] })
        // message.delete().then(msg => console.log(`Deleted message from ${ msg.author.username }`))
        //     .catch(console.error);
    }
};