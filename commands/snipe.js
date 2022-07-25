const Discord = require('discord.js')



module.exports = {
    name: 'snipe',
    description: 'snipe command',

    async execute(client, message, args) {
        const msg = client.snipes.get(message.channel.id)


        if (!msg) {
            return message.channel.send("Didn't find any deleted messages");

        }


        const embed = new Discord.MessageEmbed()
            .setAuthor({ name: msg.author.username, iconURL: msg.author.displayAvatarURL() })
            .setDescription(msg.content)
            .setFooter({ text: "Sniped..." })
            .setTimestamp();

        if (msg.image) {
            embed.setImage(msg.image)
        }
        message.channel.send({ embeds: [embed] });
    }
}