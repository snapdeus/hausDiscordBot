require('dotenv').config()
const axios = require('axios')
const apiKey = process.env.TRANSISTOR_API_KEY;
const config = { headers: { 'x-api-key': apiKey } }


const Discord = require('discord.js');


module.exports = {
    name: 'totalepisodes',
    description: 'get total episodes',

    async execute(client, message, args) {




        const totalEpisodes = async () => {
            try {
                const url = `https://api.transistor.fm/v1/episodes?pagination[page]=1&pagination[per]=1&fields`
                const res = await axios.get(url, config)

                const numEps = await res.data.data[0].attributes.number;




                message.channel.send(`Current Total Episodes: ${ numEps }`);

            } catch (e) {
                console.log(e)
            }
        }
        totalEpisodes();
    }
}
