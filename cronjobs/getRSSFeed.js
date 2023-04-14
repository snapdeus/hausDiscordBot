require('dotenv').config();


const Discord = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: `./json.sqlite` });
const Parser = require('rss-parser');
const parser = new Parser();
const { https, http } = require('follow-redirects');
const axios = require;
const { v3: uuidv3 } = require('uuid');
const fs = require('fs');
const fetch = require('node-fetch');



const MY_NAMESPACE = 'ed000fe2-da29-11ed-afa1-0242ac120002';
const articlesDB = db.table('articles');
const cachedLastModifiedDB = db.table('lastModified');

const rssFeeds = {
    // ap: {
    //     name: "ap",
    //     url: 'https://rsshub.app/apnews/topics/apf-topnews'
    // },
    yahoo: {
        name: "yahoo",
        url: 'https://yahoo.com/news/rss'
    },
    dw: {
        name: "dw",
        url: 'https://rsshub.app/dw/en'
    },
    al: {
        name: "aljazeera",
        url: 'https://rsshub.app/aljazeera/english/news'
    },
    bbc: {
        name: "bbc",
        url: 'https://rsshub.app/bbc'
    },

};


const fetchAndParseFeed = async (feedObj) => {
    let feedUrl = feedObj.url;
    let feedName = feedObj.name;
    try {


        const previousLastModified = await cachedLastModifiedDB.get(feedName);

        const fetchOptions = previousLastModified ? { headers: { 'If-Modified-Since': previousLastModified } } : {};
        console.log(fetchOptions);

        const response = await fetch(feedUrl, fetchOptions);

        if (response.status === 304) {
            console.log('No new articles found.');
            return;
        }
        const lastModified = response.headers.get('Last-Modified');
        console.log(lastModified, "last modified for ", feedName);
        if (lastModified) {
            await cachedLastModifiedDB.set(feedName, lastModified);
        }





        const feed = await parser.parseURL(feedUrl);




        const articles = feed.items;

        // console.log(articles[0].link, articles[0].title);
    } catch (error) {
        console.log(`Error fetching or parsing the feed: ${ error }`);
    }

};


const testpost = async (feeds) => {
    for (const feedUrl of Object.values(feeds)) {
        const newArticle = await fetchAndParseFeed(feedUrl);
        if (newArticle) {
            console.log(newArticle);
        }
    }
};

for (let link of Object.values(rssFeeds)) {
    fetchAndParseFeed(link);
}

module.exports.getNewsArticle = async () => {
    try {

        let article = await getUniqueArticle();
        //create embed
        const embedMsg = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`${ article.title }`)
            .setURL(`${ article.link }`)
            .setDescription(`${ article.pubDate }`);

        return { embedMsg };

    } catch (e) {
        console.log(e);
    }
};