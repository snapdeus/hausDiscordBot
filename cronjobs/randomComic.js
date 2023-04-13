require('dotenv').config();
const ObjectID = require('mongodb').ObjectId;
const GayComic = require('../models/gayComics');
const Discord = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB();

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


const generateRandom = async (min, max, exclude) => {
    if (!(await db.has('comicsArray'))) {
        await db.set('comicsArray', [0]);
    }
    let ranNum = Math.floor(Math.random() * (max - min)) + min;
    let cache = await db.get('comicsArray');
    if (ranNum === exclude || cache.includes(ranNum)) {
        return generateRandom(min, max, exclude);
    }
    await addComicToCache(ranNum);
    return ranNum;
};

async function addComicToCache(num) {
    await db.push('comicsArray', num);
    let cache = db.get('comicsArray');
    if (cache.length > 500) {
        cache.shift();
        await db.set('comicsArray', cache);
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
            .sort({ ordinality: -1 });
        //the + 1 is bc randomNumber generator is not inclusive
        const totalGayComics = maxNumber.ordinality + 1;
        const totalPages = Math.ceil(totalGayComics / 15);
        let pageNumber;
        //generate random number excluding 0 and cache
        let randomNumber = await generateRandom(1, totalGayComics, 0);

        //retrieve comic

        const comic = await GayComic.find({ ordinality: `${ randomNumber }` });

        const comicNumber = comic[0].ordinality;
        //calculate page number
        if (comicNumber % 15 >= totalGayComics % 15 || comicNumber % 15 === 0) {
            pageNumber = totalPages - Math.ceil(comicNumber / 15);
        } else if (comicNumber % 15 < totalGayComics % 15) {
            pageNumber = totalPages - (Math.ceil(comicNumber / 15) - 1);
        }

        //create embed
        const embedMsg = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`#${ comic[0].ordinality } ${ comic[0].title }`)
            .setURL(`https://hausofdecline.com/comics/gay/${ pageNumber }/${ comic[0].id }`)
            .setImage(`https://hausofdecline.com/uploads/GayComics/${ comic[0].filename }`);

        return { embedMsg };

    } catch (e) {
        console.log(e);
    }
};