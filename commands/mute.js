
const Discord = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: `./json.sqlite` });

module.exports = {
    name: "mute",

    async execute(client, message, args) {
        if (!message.member.permissions.has("ADMINISTRATOR")) {
            return message.channel.send("NO. **You can not use this command | Permission: ADMINISTRATOR**");
        }
        if (!message.member.permissions.has("MUTE_MEMBERS")) {
            return message.channel.send("NO. **I do not have the correct permissions | Permission : MUTE_MEMBERS**");
        }

        const user = message.mentions.members.first();

        if (!user) {
            return message.channel.send("NO. **Please mention the user for mute**");
        }
        if (user.id === message.author.id) {
            return message.channel.send("NO. **I can't mute you because you are message author**");
        }
        let reason = args.slice(1).join("");

        if (!reason) {
            return message.channel.send("NO. **Please give some reason for mute** ");
        }


        const vrole = user.roles.cache;

        let muterole = message.guild.roles.cache.find(x => x.name === "Muted");
        if (!muterole) {
            try {
                muterole = await message.guild.roles.create({

                    name: "Muted",
                    color: "#8b6363",
                    permissions: ['ADD_REACTIONS', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY']

                });
            } catch (e) {
                console.log(e.stack);
            }
        }
        // await user.roles.remove(vrole);
        await user.roles.add(muterole);




        var mute = new Discord.MessageEmbed()
            .setTitle('User Mute')
            .addField('Username', `**${ message.mentions.users.first().username }**`)
            .addField('Muted by', `**${ message.author }**`)
            .addField('Reason', `**${ reason }**`);




        let mChannel = await db.get(`modlog_${ message.guild.id }`);
        if (!mChannel) return message.channel.send({ embeds: [mute] });
        let muteChannel = message.guild.channels.cache.get(mChannel);
        if (!muteChannel) return;

        muteChannel.send({ embeds: [mute] });
        user.send(`**You are now muted from ${ message.guild.name } because of reason: ${ reason }**`);
    }
};