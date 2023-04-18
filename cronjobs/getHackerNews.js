require('dotenv').config();


const Discord = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: `./json.sqlite` });

const axios = require('axios');
const { fetchOgImage } = require('../utils/linkUtils');
let config;
let botId;
if (process.env.NODE_ENV?.trim() === 'development') {
    config = require('../config/config.test.json');
    botId = '884512701798285372';
} else {
    botId = '968597421435256846';
    config = require('../config/config.json');
}





const hackerNewsDB = db.table('hackerNews');
const getTopStories = async () => {


    try {
        const url = 'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty&orderBy="$priority"&limitToFirst=5';
        const res = await axios.get(url);

        return (res.data);

    } catch (e) {
        console.log(e);
    }
};




const createArticleLinks = async () => {
    try {
        if (!(await hackerNewsDB.get('itemsArray'))) {
            await hackerNewsDB.set('itemsArray', []);
        }
        const prevStories = await hackerNewsDB.get('itemsArray');
        const topStories = await getTopStories();
        //if there are no previous stories in db, add all new top stories to db and return them
        if (prevStories.length === 0) {
            await hackerNewsDB.push('itemsArray', ...topStories);
            return topStories;
        }

        //filter the previous stories that are currently in db, and only return new stories
        const filteredStories = topStories.filter(val => !prevStories.includes(val));

        //if there are indeed some need stories, push the new ones onto the db
        if (filteredStories.length > 0) {
            await hackerNewsDB.push('itemsArray', ...filteredStories);
        }

        //clear cache array if needed
        if (prevStories.length >= 50) {
            prevStories.splice(0, 30);
            await hackerNewsDB.set('itemsArray', prevStories);
            console.log('deleted some hackers news articles from dbrun ');
        }

        //return the new stories (there may not be any, caution may return empty array)

        return filteredStories;

    } catch (error) {
        console.error(error);
    }
};




module.exports.retrieveTechArticlesAndSend = async (client) => {
    const receivedItems = await createArticleLinks();
    const channel = client.channels.cache.get(config.TECH_CHANNEL);
    if (receivedItems.length === 0) {
        return;
    }

    const articleObjectsArray = [];
    for (i of receivedItems) {
        const url = `https://hacker-news.firebaseio.com/v0/item/${ i }.json?print=pretty`;
        const itemObj = await axios.get(url);
        articleObjectsArray.push(itemObj.data);
    }
    for (articleObject of articleObjectsArray) {
        let imageURL;
        try {
            imageURL = await fetchOgImage(articleObject.url);
        } catch (e) {
            console.log(e);
        }

        const embedMsg = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(articleObject.title)
            .setDescription(` New Article on Hacker News! `)
            .setURL(articleObject.url)
            .setImage(imageURL ? imageURL : 'https://i.imgur.com/G1CV4Hd.png');
        channel.send({ embeds: [embedMsg] });
    }
};

