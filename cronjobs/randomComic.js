require('dotenv').config()
const ObjectID = require('mongodb').ObjectId;
const GayComic = require('../models/gayComics')
const Discord = require('discord.js')
const db = require("quick.db")

//OLD WAY WITH NON PERSISTENT CACHE
// const numCache = [];
//function generates a random number and excludes, and then caches it
// const generateRandomBetween = (min, max, exclude) => {
//     let ranNum = Math.floor(Math.random() * (max - min)) + min;

//     if (ranNum === exclude || numCache.includes(ranNum)) {
//         return generateRandomBetween(min, max, exclude);
//     }

//     numCache.push(ranNum);
//     if (numCache.length > 23) numCache.shift();
//     return ranNum;
// }


const generateRandom = (min, max, exclude) => {
    if (!db.has('comicsArray')) {
        db.set('comicsArray', [0])
    }
    let ranNum = Math.floor(Math.random() * (max - min)) + min;
    let cache = db.get('comicsArray')
    if (ranNum === exclude || cache.includes(ranNum)) {
        return generateRandom(min, max, exclude);
    }
    addComicToCache(ranNum)
    return ranNum
}

function addComicToCache(num) {
    db.push('comicsArray', num)
    let cache = db.get('comicsArray')
    if (cache.length > 300) {
        cache.shift()
        db.set('comicsArray', cache)
    }
}
//deletes the entire array & key
// function delDB() {
//     db.delete('comicsArray')
// }
// delDB()


module.exports.getRandomComic = async () => {
    try {
        //get totals
        const maxNumber = await GayComic.findOne({})
            .sort({ ordinality: -1 })
        //the + 1 is bc randomNumber generator is not inclusive
        const totalGayComics = maxNumber.ordinality + 1
        const totalPages = Math.ceil(totalGayComics / 15)
        let pageNumber;
        //generate random number excluding 0 and cache
        let randomNumber = generateRandom(1, totalGayComics, 0)

        //retrieve comic

        const comic = await GayComic.find({ ordinality: `${ randomNumber }` })

        const comicNumber = comic[0].ordinality
        //calculate page number
        if (comicNumber % 15 >= totalGayComics % 15 || comicNumber % 15 === 0) {
            pageNumber = totalPages - Math.ceil(comicNumber / 15)
        } else if (comicNumber % 15 < totalGayComics % 15) {
            pageNumber = totalPages - (Math.ceil(comicNumber / 15) - 1)
        }

        //create embed
        const embedMsg = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`#${ comic[0].ordinality } ${ comic[0].title }`)
            .setURL(`https://hausofdecline.com/comics/gay/${ pageNumber }/${ comic[0].id }`)
            .setImage(`https://hausofdecline.com/uploads/GayComics/${ comic[0].filename }`);

        return { embedMsg };

    } catch (e) {
        console.log(e)
    }
}