require('dotenv').config();

const path = require('path')
const axios = require('axios')
const mongoose = require('mongoose')
const randomComic = require('./randomComic')
const episodes = require('./episodes')
const fs = require('fs')
const Discord = require('discord.js')
const { Client, Intents } = require('discord.js');



const apiKey = process.env.TRANSISTOR_API_KEY;
const config = { headers: { 'x-api-key': apiKey } }


const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
client.commands = new Discord.Collection();

const prefix = "!"



mongoose.connect(`mongodb://localhost:27017/${ process.env.MONGO_USER }?authSource=admin`, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify: false
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PW,
    autoIndex: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});


const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${ file }`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}




client.on('ready', () => {
    console.log('hausBot logged in')
    // async function retrieveEpisodeAndSend() {
    //     const { episode, numEps, pageNumber } = await episodes.getRandomShow();
    //     console.log(numEps, episode.attributes.number)
    //     const channel = client.channels.cache.get('968599620366250024');
    //     channel.send(`https://hausofdecline.com/episodes/${ pageNumber }/${ episode.id }`)
    // }
    // setInterval(() => retrieveEpisodeAndSend(), 10000)


})




client.on('messageCreate', msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const args = msg.content.slice(prefix.length).trim().split(' ');
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    try {
        command.execute(msg, args);
    } catch (error) {
        console.error(error);
        msg.reply('there was an error trying to execute that command!');
    }
})



// const getShow = async () => {
//     try {
//         const url = `https://api.transistor.fm/v1/episodes?pagination[page]=1&pagination[per]=100000&fields`
//         const res = await axios.get(url, config)
//         const epNumber = 100;
//         const episode = res.data.data.filter(ep => ep.attributes.number === epNumber)


//         console.log(episode[0])
//     } catch (e) {
//         console.log(e);
//     }
// };

// getShow();

client.login(process.env.BOT_TOKEN)