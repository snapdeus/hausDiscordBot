const Discord = require('discord.js')



module.exports = {
    name: 'snipe',
    description: 'snipe command',

    async execute(client, message, args) {
        const msg = client.snipes.get(message.channel.id)


        if (!msg) {
            return message.channel.send("Didn't find any deleted messages");

        }

        const dateObject = new Date(msg.timestamp)
        const humanDateFormat = dateObject.toLocaleString()

        const embed = new Discord.MessageEmbed()
            .setThumbnail('https://i.imgur.com/wXJxcum.gif')
            .setAuthor({ name: msg.author.username, iconURL: msg.author.displayAvatarURL() })
            .setDescription(msg.content)
            .setFooter({ text: `Sniped message originally created at ${ humanDateFormat }` })
        if (msg.image) {
            embed.setImage(msg.image)
        }
        message.channel.send({ embeds: [embed] });
    }
}