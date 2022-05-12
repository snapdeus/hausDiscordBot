const db = require('quick.db')
const Discord = require("discord.js");
const { MessageEmbed, MessageReaction } = require("discord.js");



module.exports = {
    name: "idban",

    async execute(client, message, args) {
        if (!message.member.permissions.has("BAN_MEMBERS")) return message.channel.send('NO. **You can not use this command | Permission: BAN_MEMBERS**')
        if (!message.member.permissions.has("BAN_MEMBERS")) return message.channel.send('NO. **I do not have the correct permissions**')

        const target = args[0];
        if (isNaN(target)) return message.reply(`NO. **Please specify an ID**`);

        const reason = args.splice(1, args.length).join(' ');



        try {
            message.guild.members.cache.get(target).ban({ reason: reason.length < 1 ? '**No reason supplied**' : reason });
            const e = new MessageEmbed()
                .setAuthor({ name: `User has been banned`, iconURL: message.guild.iconURL() })
                .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
                .addField("**ID**", `**${ target }**`)
                .addField("**Banned By**", `**${ message.author.username }**`)
                .addField("**Reason**", `**${ reason || "**No Reason**" }**`)
                .setTimestamp();


            let mChannel = db.fetch(`modlog_${ message.guild.id }`)
            if (!mChannel) return message.channel.send(e)
            let banChannel = message.guild.channels.cache.get(mChannel)
            if (!banChannel) return;
            banChannel.send({ embeds: [e] })

        } catch (error) { console.log(error) }

    }
}