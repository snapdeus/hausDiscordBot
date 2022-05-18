require('dotenv').config();

const path = require('path')
const axios = require('axios')
const mongoose = require('mongoose')
const randomComic = require('./cronjobs/randomComic')
const randomEpisodes = require('./cronjobs/randomEpisodes')
const fs = require('fs')
const Discord = require('discord.js')
const { Client, Intents } = require('discord.js');
const cron = require('node-cron')



const apiKey = process.env.TRANSISTOR_API_KEY;
const config = { headers: { 'x-api-key': apiKey } }


const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS] });
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


    // setInterval(() => retrieveEpisodeAndSend(), 5000)


    const retrieveComicAndSend = async () => {
        const { embedMsg } = await randomComic.getRandomComic();
        const channel = client.channels.cache.get(process.env.COMIC_CHANNEL);
        channel.send({ embeds: [embedMsg] });
    }

    cron.schedule('0 */2 * * *', () => {
        retrieveComicAndSend();
    });


    // setInterval(() => retrieveComicAndSend(), 2000)


})


client.on('messageCreate', message => {
    if (message.content.toLowerCase() === 'obamna' && !message.author.bot) {
        message.reply('SODA')
    } else if (message.content.toLowerCase() === 'soda' && !message.author.bot) {
        message.reply('Obamna')
    }
    // if (message.content.toLowerCase().includes('cum sum') || (message.content.toLowerCase().includes('sum') && message.content.toLowerCase().includes('cum')) || (message.content.match(/c.m/gi) && message.content.match(/s.m/gi))) 

    // console.log(message.content.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))

    // if ((message.content.trim().match(/\bc.*m\b/gi) && message.content.trim().match(/\bs.*m\b/gi) || message.content.trim().replace(/\s/g, '').match('cumsum'))) {
    //     message.delete()
    //     message.channel.send('NO.')

    // }

    const cumArgs = message.content.split(' ')

    const msgContent1 = Array.from(new Set(cumArgs[0])).join('')
    const msgContent2 = Array.from(new Set(cumArgs[1])).join('')
    // console.log(msgContent1, msgContent2)


    if ((message.content.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "").match('cum') && message.content.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "").match('sum') || message.content.trim().replace(/\s/g, '').match('cumsum') || msgContent1.match('cum') && msgContent2.match('sum'))) {
        message.delete()
        message.channel.send('NO.')

    }
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(' ');
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    try {
        command.execute(client, message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
})




client.login(process.env.BOT_TOKEN)