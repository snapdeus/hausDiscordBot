
const Discord = require('discord.js');
const db = require('quick.db')

module.exports = {
    name: "warn",

    async execute(client, message, args) {
        var embedColor = '0x5D40F2'

        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send('NO. **You can not use this command | Permission: ADMINISTRATOR**')
        if (!message.member.permissions.has("MANAGE_CHANNELS")) return message.channel.send('NO. **I do not have the correct permissions | Permission : MANAGE_CHANNELS**')


        const user = message.mentions.members.first();

        if (!user) {
            return message.channel.send(
                "NO. **Please mention a user**"
            );
        }

        if (message.mentions.users.first().bot) {
            return message.channel.send("NO. **You can not warn bots**");
        }

        if (message.author.id === user.id) {
            return message.channel.send("NO. **You can not warn yourself -_-**");
        }

        if (user.id === message.guild.ownerId) {
            return message.channel.send(
                "NO. **Bruh, you can not warn server owner -_-**"
            );
        }

        const reason = args.slice(1).join(" ");

        if (!reason) {
            return message.channel.send(
                "NO. **Please provide reason to warn**"
            );
        }



        let warnings = db.get(`warnings_${ message.guild.id }_${ user.id }`);

        if (warnings === null) {
            db.set(`warnings_${ message.guild.id }_${ user.id }`, 1);
            const authorName = message.author.username;

            var warningEmbed = new Discord.MessageEmbed()
                .setColor(embedColor)
                .setAuthor({ name: authorName })
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 2048, format: "png" }))
                .setTitle(`**You've been warned in ${ message.guild.name }**`)
                .addField('Warned by', `**${ message.author.tag }**`)
                .addField('Reason', `**${ reason }**`)
                .setTimestamp();
            user.send({ embeds: [warningEmbed] });

            var warnSuccessfulEmbed = new Discord.MessageEmbed()
                .setColor(embedColor)
                .setDescription(` **User Successfully Warned**`)
                .addField('Warned by', `${ message.author }`)
                .addField('Reason', `**${ reason }**`)
            let mChannel = db.fetch(`modlog_${ message.guild.id }`)
            if (!mChannel) return message.channel.send(warnSuccessfulEmbed)
            let warnChannel = message.guild.channels.cache.get(mChannel)
            if (!warnChannel) return;
            warnChannel.send({ embeds: [warnSuccessfulEmbed] })
        } else if (warnings !== null) {

            db.add(`warnings_${ message.guild.id }_${ user.id }`, 1);
            const authorName = message.author.username;
            console.log(authorName)
            var warningEmbed = new Discord.MessageEmbed()
                .setColor(embedColor)
                .setAuthor({ name: authorName })
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 2048, format: "png" }))
                .setTitle(`**You've been warned in ${ message.guild.name }**`)
                .addField('Warned by', `**${ message.author.tag }**`)
                .addField('Reason', `**${ reason }**`)
                .setTimestamp();
            user.send({ embeds: [warningEmbed] });

            var warnSuccessfulEmbed = new Discord.MessageEmbed()
                .setColor(embedColor)
                .setDescription(` **User Successfully Warned**`)
                .addField('Warned by', `${ message.author }`)
                .addField('Reason', `**${ reason }**`)

            message.delete().then(msg => console.log(`Deleted message from ${ msg.author.username }`))
                .catch(console.error);
            let mChannel = db.fetch(`modlog_${ message.guild.id }`)
            if (!mChannel) return message.channel.send({ embeds: [warnSuccessfulEmbed] })
            let warnChannel = message.guild.channels.cache.get(mChannel)
            if (!warnChannel) return;
            warnChannel.send({ embeds: [warnSuccessfulEmbed] })


        }
    }
}