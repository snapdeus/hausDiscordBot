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

const hackerNewsDB = db.table('computerTech');
const getTopStories = async () => {


    try {
        const url = 'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty&orderBy="$priority"&limitToFirst=5';
        const res = await axios.get(url);

        return res.data;

    } catch (e) {
        console.log(e);
    }
};




const createArticleLinks = async () => {
    try {

        const topStories = await getTopStories();

        let storyIdArray = [];
        for (storyId of topStories) {
            let idString = storyId.toString();
            if (!(await hackerNewsDB.get(idString))) {
                storyIdArray.push(idString);
                await hackerNewsDB.set(idString, true);
            }
        }

        return storyIdArray;

    } catch (error) {
        console.error(error);
    }
};


async function deleteArticles() {
    const cachedArticles = await hackerNewsDB.all();

    if (cachedArticles.length > 30) {
        for (let i = 0; i < 5; i++) {
            await hackerNewsDB.delete(cachedArticles[i].id);
        }
        console.log("deleted some articles from computerTechDB");
    }
}


module.exports.retrieveTechArticlesAndSend = async (client) => {
    const receivedItems = await createArticleLinks();
    const channel = client.channels.cache.get(config.TECH_CHANNEL);
    if (receivedItems.length === 0) {
        console.log('no new computerTech articles');
        return;
    }

    const articleObjectsArray = [];
    //potentially replace this for with map
    for (i of receivedItems) {
        const url = `https://hacker-news.firebaseio.com/v0/item/${ i }.json?print=pretty`;
        const { data } = await axios.get(url);
        let image;
        try {
            image = await fetchOgImage(data.url)

        } catch (e) {
            console.log(e);
        }
        data.imageURL = image ? image : 'https://i.imgur.com/G1CV4Hd.png'
        articleObjectsArray.push(data);
    }


    for (articleObject of articleObjectsArray) {
        const embedMsg = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(articleObject.title)
            .setDescription(` New Article on Hacker News! `)
            .setURL(articleObject.url)
            .setImage(articleObject.imageURL);
        channel.send({ embeds: [embedMsg] });
    };
    deleteArticles();
};

