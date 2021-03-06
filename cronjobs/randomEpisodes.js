
require('dotenv').config();
const axios = require('axios')
const apiKey = process.env.TRANSISTOR_API_KEY;
const config = { headers: { 'x-api-key': apiKey } }
const Discord = require('discord.js')
const db = require("quick.db")




const getNumOfEps = async () => {
    try {
        const url = `https://api.transistor.fm/v1/episodes?pagination[page]=1&pagination[per]=500`
        const res = await axios.get(url, config)
        const numEps = parseInt(res.data.meta.totalCount)
        const idArray = [];
        for (let i = 0; i < numEps; i++) {
            idArray.push(res.data.data[i].id)
        }
        return { numEps, idArray };
    } catch (e) {
        console.log(e);
    }
};


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//NO MAX IN THIS FUNCTION BECAUSE WE ARE GETTING numEps WHICH IS THE MAX
async function generateRandom(min, exclude) {
    if (!db.has('episodesArray')) {
        db.set('episodesArray', [0])
    }
    await sleep(1000)
    const { numEps, idArray } = await getNumOfEps()
    let ranNum = Math.floor(Math.random() * (numEps - min)) + min;
    let cache = db.get('episodesArray')
    idArray[ranNum]
    let randomEpisodeId = parseInt(idArray[ranNum])
    console.log(cache.includes(randomEpisodeId))
    //no episode 58
    if (ranNum === exclude || cache.includes(randomEpisodeId)) {
        return generateRandom(min, exclude);
    }
    addEpisodeToCache(randomEpisodeId)
    return { randomEpisodeId, numEps }
}

function addEpisodeToCache(id) {
    db.push('episodesArray', id)
    let cache = db.get('episodesArray')
    // console.log(cache)
    if (cache.length > 100) {
        cache.shift()
        db.set('episodesArray', cache)
    }
}


module.exports.getRandomShow = async () => {
    let { randomEpisodeId, numEps } = await generateRandom(1, 0)
    console.log(randomEpisodeId)
    try {
        const url = `https://api.transistor.fm/v1/episodes/` + `${ randomEpisodeId }`
        const res = await axios.get(url, config)
        // console.log(res.data.data[randomNumber].id)
        const episode = res.data.data
        let episodeNumber = episode.attributes.number;
        let totalPages = (Math.ceil(numEps / 10))
        let pageNumber;
        if (episodeNumber % 10 >= numEps % 10 || episodeNumber % 10 === 0) {
            pageNumber = totalPages - Math.ceil(episodeNumber / 10)
        } else if (episodeNumber % 10 < numEps % 10) {
            pageNumber = totalPages - (Math.ceil(episodeNumber / 10) - 1)
        }


        //create embed
        const embedMsg = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`#${ episode.attributes.number } ${ episode.attributes.title }`)
            .setURL(`https://hausofdecline.com/episodes/${ pageNumber }/${ episode.id }`)
            .addField("Date", episode.attributes.formatted_published_at)
            .addField("Summary", episode.attributes.summary)
            .setImage(episode.attributes.image_url);


        return { episode, numEps, pageNumber, embedMsg };


    } catch (e) {
        console.log(e);
    }
};


