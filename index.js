require('dotenv').config();

const path = require('path')
const axios = require('axios')
const mongoose = require('mongoose')
const randomComic = require('./randomComic')
const episodes = require('./episodes')

const { Client, Intents } = require('discord.js');



const apiKey = process.env.TRANSISTOR_API_KEY;
const config = { headers: { 'x-api-key': apiKey } }


const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });

// client.on('ready', async () => {
//     console.log('hausBot logged in')

//     const { episode, numEps } = await episodes.getRandomShow();
//     console.log(numEps, episode.attributes.number)
//     const channel = client.channels.cache.get('968599620366250024');

//     setInterval(() => channel.send(`https://hausofdecline.com/episodes/1/${ episode.id }`), 3000)

// })



client.on('ready', () => {
    console.log('hausBot logged in')
    async function retrieveEpisodeAndSend() {
        const { episode, numEps } = await episodes.getRandomShow();
        console.log(numEps, episode.attributes.number)
        const channel = client.channels.cache.get('968599620366250024');
        let episodeNumber = episode.attributes.number;
        let totalPages = (Math.ceil(numEps / 10))
        let pageNumber;
        if (episodeNumber % 10 >= numEps % 10 || episodeNumber % 10 === 0) {
            pageNumber = totalPages - Math.ceil(episodeNumber / 10)
        } else if (episodeNumber % 10 < numEps % 10) {
            pageNumber = totalPages - (Math.ceil(episodeNumber / 10) - 1)
        }
        channel.send(`https://hausofdecline.com/episodes/${ pageNumber }/${ episode.id }`)

    }

    setInterval(() => retrieveEpisodeAndSend(), 10000)

})


client.login(process.env.BOT_TOKEN)