require('dotenv').config()
const axios = require('axios')
const apiKey = process.env.TRANSISTOR_API_KEY;
const config = { headers: { 'x-api-key': apiKey } }


const Discord = require('discord.js');




module.exports = {
    name: 'episode',
    description: 'replies with episode',
    execute(client, message, args) {
        if (!args.length) {
            return message.channel.send('Which episode number?')
        }

        if (isNaN(parseInt(args[0]))) {
            return message.channel.send(`Was that a number?!`);
        }

        if (args[0] == 0) {
            return message.channel.send('What is a 0th episode?')
        }
        if (args[0] < 0) {
            return message.channel.send('No negative numbers please')
        }


        if (args[0] == 58) {
            return message.channel.send('There is no episode 58.')
        }

        const getShow = async () => {
            try {
                const url = `https://api.transistor.fm/v1/episodes?pagination[page]=1&pagination[per]=100000&fields`
                const res = await axios.get(url, config)
                const epNumber = parseInt(args[0]);
                const numEps = await res.data.data[0].attributes.number;
                const episode = await res.data.data.filter(ep => ep.attributes.number === epNumber)
                let totalPages = (Math.ceil(numEps / 10))
                let pageNumber;
                if (epNumber % 10 >= numEps % 10 || epNumber % 10 === 0) {
                    pageNumber = totalPages - Math.ceil(epNumber / 10)
                } else if (epNumber % 10 < numEps % 10) {
                    pageNumber = totalPages - (Math.ceil(epNumber / 10) - 1)
                }

                if (epNumber > numEps) {
                    return message.channel.send(`We don't have that many episodes yet`);
                }

                const embedMsg = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(episode[0].attributes.title)
                    .setURL(`https://hausofdecline.com/episodes/${ pageNumber }/${ episode[0].id }`)
                    .addField("Date", episode[0].attributes.formatted_published_at)
                    .addField("Summary", episode[0].attributes.summary)
                    .setImage(episode[0].attributes.image_url);

                message.channel.send({ embeds: [embedMsg] });
                // console.log(episode[0].attributes.title)
            } catch (e) {
                console.log(e);
            }
        };

        getShow();

    }
}

