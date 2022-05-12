
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
                .addField('Think Carefully', "Your next warning will result in a mute.")
                .setTimestamp();
            user.send({ embeds: [warningEmbed] });

            var warnSuccessfulEmbed = new Discord.MessageEmbed()
                .setColor(embedColor)
                .setDescription(` **${ user } Successfully Warned**`)
                .addField('Warned by', `${ message.author }`)
                .addField('Reason', `**${ reason }**`)
            let mChannel = db.fetch(`modlog_${ message.guild.id }`)
            if (!mChannel) return message.channel.send(warnSuccessfulEmbed)
            let warnChannel = message.guild.channels.cache.get(mChannel)
            if (!warnChannel) return;
            warnChannel.send({ embeds: [warnSuccessfulEmbed] })
        } else if (warnings === 1) {

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
                .addField('2nd Warning', "You have been muted.")
                .addField('Think Carefully', "Your next warning will result in a kick.")
                .setTimestamp();
            user.send({ embeds: [warningEmbed] });

            var warnSuccessfulEmbed = new Discord.MessageEmbed()
                .setColor(embedColor)
                .setDescription(` **${ user } Successfully Warned & Muted**`)
                .addField('Warned by', `${ message.author }`)
                .addField('Reason', `**${ reason }**`)


            let muterole = message.guild.roles.cache.find(x => x.name === "Muted");
            if (!muterole) {
                try {
                    muterole = await message.guild.roles.create({

                        name: "Muted",
                        color: "#8b6363",
                        permissions: ['ADD_REACTIONS', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY']

                    })
                } catch (e) {
                    console.log(e.stack);
                }
            }
            // await user.roles.remove(vrole);
            await user.roles.add(muterole);

            setTimeout(() => {
                user.roles.remove(muterole);
            }, 3600000)



            let mChannel = db.fetch(`modlog_${ message.guild.id }`)
            if (!mChannel) return message.channel.send({ embeds: [warnSuccessfulEmbed] })
            let warnChannel = message.guild.channels.cache.get(mChannel)
            if (!warnChannel) return;
            warnChannel.send({ embeds: [warnSuccessfulEmbed] })

        } else if (warnings === 2) {
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
                .addField('3rd Warning', "You have been kicked.")
                .addField('Think Carefully', "If your next warning will result in being permanently banned.")
                .setTimestamp();

            var warnSuccessfulEmbed = new Discord.MessageEmbed()
                .setColor(embedColor)
                .setDescription(` **${ user } Successfully Warned & Kicked, 3rd warning**`)
                .addField('Warned by', `${ message.author }`)
                .addField('Reason', `**${ reason }**`)


            user.send({ embeds: [warningEmbed] })
                .catch(() => message.reply("unable to send message"))
                .then(() => user.kick(reason))
                .catch(err => {
                    if (err) console.log(err)
                })


            let mChannel = db.fetch(`modlog_${ message.guild.id }`)
            if (!mChannel) return message.channel.send({ embeds: [warnSuccessfulEmbed] })
            let warnChannel = message.guild.channels.cache.get(mChannel)
            if (!warnChannel) return;
            warnChannel.send({ embeds: [warnSuccessfulEmbed] })


        } else if (warnings === 3) {
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
                .addField('Final Warning', "You have been banned.")
                .setTimestamp();

            var warnSuccessfulEmbed = new Discord.MessageEmbed()
                .setColor(embedColor)
                .setDescription(` **${ user } BANNED, final warning**`)
                .addField('Warned by', `${ message.author }`)
                .addField('Reason', `**${ reason }**`)


            user.send({ embeds: [warningEmbed] })
                .catch(() => message.reply("unable to send message"))
                .then(() => message.guild.members.cache.get(user.id).ban({ reason: reason }))
                .catch(err => {
                    message.reply('I was unable to ban the member');
                    console.error(err);
                })


            let mChannel = db.fetch(`modlog_${ message.guild.id }`)
            if (!mChannel) return message.channel.send({ embeds: [warnSuccessfulEmbed] })
            let warnChannel = message.guild.channels.cache.get(mChannel)
            if (!warnChannel) return;
            warnChannel.send({ embeds: [warnSuccessfulEmbed] })


        }
    }
}