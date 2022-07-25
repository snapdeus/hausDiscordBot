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
const { createRandomPhrase, makeUniqueGreeting } = require('./utils/phraseFunctions')




const apiKey = process.env.TRANSISTOR_API_KEY;
const config = { headers: { 'x-api-key': apiKey } }


const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS] });
client.commands = new Discord.Collection();

client.snipes = new Discord.Collection();

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
    // cron.schedule('*/1 * * * *', () => {
    //     retrieveEpisodeAndSend();
    // });



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
    if (message.content.toLowerCase().includes('obamna') && !message.author.bot) {
        message.reply('SODA')
    } else if (message.content.toLowerCase().includes('soda') && !message.author.bot) {
        message.reply('Obamna')
    }
    if (message.content.toLowerCase().includes('fresh')) {
        message.delete();
        message.channel.send('Do not utter the banned word.');
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

client.on('messageDelete', (message, channel) => {
    client.snipes.set(message.channel.id,
        {
            content: message.content,
            author: message.author,
            image: message.attachments.first() ? message.attachments.first().proxyURL : null
        })

})

client.on('guildMemberAdd', async member => {
    member.guild.channels.cache.get('977643932387270746').send(`${ makeUniqueGreeting() }, <@${ member.user.id }>.  ${ await createRandomPhrase() }`);


});


client.login(process.env.BOT_TOKEN)