
const Discord = require('discord.js');
const db = require('quick.db')

module.exports = {
    name: "report",

    async execute(client, message, args) {
        let prefix = "!"
        let messageArray = message.content.split(" ")
        let cmd = messageArray[0];
        let report = messageArray.join(" ").slice(0);
        let user = message.author;
        let guild = message.guild.name;

        const embed = new Discord.MessageEmbed()
            .setTitle("Report")
            .addField("Report", `**${ report }**`)
            .addField("Reported By", `**${ user }**`)
            .addField("Reported in", `**${ guild }**`)
            .setFooter({ text: `${ client.user.username }`, iconURL: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) });

        user.send(`**Your report has been filed in the official server. It will be reviewed so please be patient. For your records, the report was: ${ report }**`)
        let mChannel = db.fetch(`modlog_${ message.guild.id }`)
        if (!mChannel) return message.channel.send(e)
        let reportChannel = message.guild.channels.cache.get(mChannel)
        if (!reportChannel) return;
        reportChannel.send({ embeds: [embed] })
        message.delete().then(msg => console.log(`Deleted message from ${ msg.author.username }`))
            .catch(console.error);
    }
}