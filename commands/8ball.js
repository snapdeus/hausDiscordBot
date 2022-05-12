const Discord = require("discord.js")

module.exports = {
    name: "8ball",
    usage: ["Let the 8ball answer your question```{prefix}8ball <question>```"],

    // Execute contains content for the command
    async execute(client, message, args) {

        if (!args[0]) return message.reply({ content: "Please ask a question", allowedMentions: { repliedUser: false } });

        let replies = [
            "Maybe.",
            "Slay, kween",
            "I hope so.",
            "Not in your wildest dreams, honey.",
            "There is a good chance you're gay, but I don't know the answer to your question",
            "Quite hornily, yes.",
            "Yaaaaaaas",
            "I hope not.",
            "I hope so.",
            "Never, bitch",
            "Your bussy busted.",
            "Sorry, bitch.",
            "Hell, yes.",
            "Hell to the no.",
            "The future is gay.",
            "The future is ridic",
            "I would rather not say.",
            "Who cares? My gaydar is vibrating.",
            "Possibly, spill the tea!",
            "Never, ever, ever (without lube).",
            "No, but your dick is hyuuuge.",
            "Yes, Daddy!",
            "lol no.",
            "Honestly, work",
            "Time for gay sex!",
            "Not my problem, not my egg shaped male vibrator either.",
            "Fierce!"
        ];
        const file = new Discord.MessageAttachment("./assets/gay8ball.png");
        let result = replies[Math.floor((Math.random() * replies.length))];
        let question = args.slice(0).join(" ");
        const embedMsg = new Discord.MessageEmbed().setColor("#0099ff")
            .setThumbnail("attachment://gay8ball.png")
            .setTitle("MAGIC GAY 8 BALL!")
            .setColor("#FF69B4")
            .addField("Question", question)
            .addField("Answer", result)


        message.channel.send({ embeds: [embedMsg], files: [file] });

    }
};