require('dotenv').config()
const ObjectID = require('mongodb').ObjectId;
const GayComic = require('../models/gayComics')
const Discord = require('discord.js')

module.exports = {
    name: 'comic',
    description: 'get comic',

    async execute(message, args) {

        const maxNumber = await GayComic.findOne({})
            .sort({ ordinality: -1 })
        const totalGayComics = maxNumber.ordinality
        const totalPages = Math.ceil(totalGayComics / 15)
        let pageNumber;

        if (!args.length) {
            return message.channel.send('Which comic number?')
        }

        if (isNaN(args[0])) {
            return message.channel.send(`Was that a number?!`);
        }

        if (args[0] == 0) {
            return message.channel.send('What is a 0th comic?')
        }

        const getComic = async () => {
            try {
                const comic = await GayComic.find({ ordinality: `${ args[0] }` })

                const comicNumber = comic[0].ordinality

                if (comicNumber % 15 >= totalGayComics % 15 || comicNumber % 15 === 0) {
                    pageNumber = totalPages - Math.ceil(comicNumber / 15)
                } else if (comicNumber % 15 < totalGayComics % 15) {
                    pageNumber = totalPages - (Math.ceil(comicNumber / 15) - 1)
                }


                const embedMsg = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`${ comic[0].title }`)
                    .setURL(`https://hausofdecline.com/comics/gay/${ pageNumber }/${ comic[0].id }`)
                    .setImage(`https://hausofdecline.com/uploads/GayComics/${ comic[0].filename }`);

                message.channel.send({ embeds: [embedMsg] });

            } catch (e) {
                console.log(e)
            }
        }
        getComic();
    }
}
