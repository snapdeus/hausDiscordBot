
require('dotenv').config();
const axios = require('axios')
const apiKey = process.env.TRANSISTOR_API_KEY;
const config = { headers: { 'x-api-key': apiKey } }
const Discord = require('discord.js')



const getNumOfEps = async () => {
    try {
        const res = await axios.get('https://api.transistor.fm/v1/episodes', config)
        return res.data.data[0].attributes.number;
    } catch (e) {
        console.log(e);
    }
};



const numCache = [];

const generateRandomBetween = (min, max, exclude) => {
    let ranNum = Math.floor(Math.random() * (max - min)) + min;

    if (ranNum === exclude || numCache.includes(ranNum)) {
        return generateRandomBetween(min, max, exclude);
    }

    numCache.push(ranNum);
    if (numCache.length > 23) numCache.shift();
    return ranNum;
}

module.exports.getRandomShow = async () => {

    const numEps = await getNumOfEps()
    let randomNumber = generateRandomBetween(1, numEps + 1, 0)
    try {
        const url = `https://api.transistor.fm/v1/episodes?pagination[page]=1&pagination[per]=` + `${ numEps }`
        const res = await axios.get(url, config)
        // console.log(res.data.data[randomNumber].id)
        const episode = res.data.data[randomNumber]
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


