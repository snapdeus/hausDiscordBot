require('dotenv').config()
const ObjectID = require('mongodb').ObjectId;
const GayComic = require('../models/gayComics')
const Discord = require('discord.js')

module.exports = {
    name: 'comic',
    description: 'get comic',

    async execute(message, args) {

        const mostRecentComic = await GayComic.findOne({})
            .sort({ ordinality: -1 })

        if (!args.length) {
            return message.channel.send('Which comic number?')
        }

        if (isNaN(args[0])) {
            return message.channel.send(`Was that a number?!`);
        }

        if (args[0] == 0) {
            return message.channel.send('What is a 0th comic?')
        }
        if (args[0] > mostRecentComic.ordinality) {
            return message.channel.send("There aren't that many yet!")
        }

        const getComic = async () => {
            try {
                const comic = await GayComic.find({ ordinality: `${ args[0] }` })
                console.log(comic[0].title)
                const embedMsg = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`${ comic[0].title }`)
                    .setURL(`https://hausofdecline.com/uploads/GayComics/${ comic[0].filename }`)
                    .setImage(`https://hausofdecline.com/uploads/GayComics/${ comic[0].filename }`);

                message.channel.send({ embeds: [embedMsg] });

            } catch (e) {
                console.log(e)
            }
        }
        getComic();
    }
}
