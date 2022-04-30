require('dotenv').config()
const ObjectID = require('mongodb').ObjectId;
const GayComic = require('./models/gayComics')
const Discord = require('discord.js')


const generateRandomBetween = (min, max, exclude) => {
    let ranNum = Math.floor(Math.random() * (max - min)) + min;

    if (ranNum === exclude) {
        ranNum = generateRandomBetween(min, max, exclude);
    }

    return ranNum;
}


module.exports.getRandomComic = async () => {
    try {

        const maxNumber = await GayComic.findOne({})
            .sort({ ordinality: -1 })
        const totalGayComics = maxNumber.ordinality + 1
        const totalPages = Math.ceil(totalGayComics / 15)
        let pageNumber;

        let randomNumber = generateRandomBetween(1, totalGayComics, 0)
        const comic = await GayComic.find({ ordinality: `${ randomNumber }` })

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

        // message.channel.send({ embeds: [embedMsg] });
        return { embedMsg };

    } catch (e) {
        console.log(e)
    }
}