
const Discord = require('discord.js');
const db = require('quick.db')


module.exports = {
    name: "unban",

    async execute(client, message, args) {

        if (!message.member.permissions.has("BAN_MEMBERS")) return message.channel.send('<NO. **You can not use this command | Permission: BAN_MEMBERS**')
        if (!message.member.permissions.has("BAN_MEMBERS")) return message.channel.send('<NO. **I do not have the correct permissions | Permission : BAN_MEMBERS**')


        let userID = args[0]
        if (isNaN(userID)) return message.reply(`<NO. **Please specify an ID**`);
        message.guild.bans.fetch().then(bans => {

            if (bans.size == 0) return message.channel.send('<NO. **No one is banned in this server**')
            let bUser = bans.find(b => b.user.id == userID)
            if (!bUser) return message.channel.send('<NO. **User not found**')
            message.guild.members.unban(bUser.user)


            const e = new Discord.MessageEmbed()
                .setAuthor({ name: `User has been unbanned`, iconURL: message.guild.iconURL() })
                .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
                .addField("**Username**", `**<@${ userID }>**`)
                .addField("**ID**", `**${ userID }**`)
                .addField("**Unbanned By**", `**${ message.author.username }**`)
                .setTimestamp();

            let mChannel = db.fetch(`modlog_${ message.guild.id }`)
            if (!mChannel) return message.channel.send(e)
            let banChannel = message.guild.channels.cache.get(mChannel)
            if (!banChannel) return;
            banChannel.send({ embeds: [e] })






        })
    }
}