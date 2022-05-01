require('dotenv').config();

const path = require('path')
const axios = require('axios')
const mongoose = require('mongoose')
const randomComic = require('./randomComic')
const randomEpisodes = require('./randomEpisodes')
const fs = require('fs')
const Discord = require('discord.js')
const { Client, Intents } = require('discord.js');
const cron = require('node-cron')



const apiKey = process.env.TRANSISTOR_API_KEY;
const config = { headers: { 'x-api-key': apiKey } }


const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
client.commands = new Discord.Collection();

const prefix = "!"



mongoose.connect(`mongodb://localhost:27017/haus-db?authSource=admin`, {
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
    const retrieveEpisodeAndSend = async () => {
        const { embedMsg } = await randomEpisodes.getRandomShow();
        const channel = client.channels.cache.get(process.env.EPISODE_CHANNEL);
        channel.send({ embeds: [embedMsg] });
    };

    cron.schedule('0 15 * * *', () => {
        retrieveEpisodeAndSend();
    });




    const retrieveComicAndSend = async () => {
        const { embedMsg } = await randomComic.getRandomComic();
        const channel = client.channels.cache.get(process.env.COMIC_CHANNEL);
        channel.send({ embeds: [embedMsg] });
    }

    cron.schedule('0 */2 * * *', () => {
        retrieveComicAndSend();
    });
})


client.on('messageCreate', msg => {
    if (msg.content.toLowerCase() === 'obamna' && !msg.author.bot) {
        msg.reply('SODA')
    } else if (msg.content.toLowerCase() === 'soda' && !msg.author.bot) {
        msg.reply('Obamna')
    }


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




client.login(process.env.BOT_TOKEN)