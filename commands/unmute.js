
const Discord = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: `./json.sqlite` });


module.exports = {
    name: "unmute",

    async execute(client, message, args) {
        if (!message.member.permissions.has("MUTE_MEMBERS")) {
            return message.channel.send("NO. **You can not use this command | Permission: MUTE_MEMBERS**");
        }
        if (!message.member.permissions.has("MUTE_MEMBERS")) {
            return message.channel.send("NO. **I do not have the correct permissions | Permission : MUTE_MEMBERS**");
        }

        const user = message.mentions.members.first();

        if (!user) {
            return message.channel.send("NO. **Please mention the member to who you want to unmute**");
        }

        let muterole = message.guild.roles.cache.find(x => x.name === "Muted");

        if (user.roles.cache.has(muterole)) {
            return message.channel.send("NO. **This user dont have a Muted role**");
        }

        user.roles.remove(muterole);



        const mute = new Discord.MessageEmbed()
            .setTitle('User Unmuted')
            .addField('Username', `**${ message.mentions.users.first().username }**`)
            .addField('Unmuted by', `**${ message.author }**`);

        let mChannel = await db.get(`modlog_${ message.guild.id }`);
        if (!mChannel) return message.channel.send(mute);
        let muteChannel = message.guild.channels.cache.get(mChannel);
        if (!muteChannel) return;
        muteChannel.send({ embeds: [mute] });


        user.send(`**You are now unmuted from ${ message.guild.name }**`);

    }
};