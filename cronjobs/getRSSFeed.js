require('dotenv').config();


const Discord = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: `./json.sqlite` });
const Parser = require('rss-parser');
const parser = new Parser();
const { https, http } = require('follow-redirects');
const axios = require;
const { v3: uuidv3 } = require('uuid');

const fetch = require('node-fetch');



const MY_NAMESPACE = 'ed000fe2-da29-11ed-afa1-0242ac120002';


const rssFeeds = {
    ap: 'https://rsshub.app/apnews/topics/apf-topnews',
    yahoo: 'https://www.yahoo.com/news/rss',
    nyt: 'https://rss.nytimes.com/services/xml/rss/nyt/US.xml',
    bbc: 'http://feeds.bbci.co.uk/news/rss.xml?edition=us#'

};

const getUniqueArticle = async () => {
    //check db for cache and create if doesn't exist
    if (!(await db.has('articlesArray'))) {
        await db.set('articlesArray', [0]);
    }
    //get article
    // let rssArticles = await parser.parseURL(rssFeeds.yahoo);
    // const articles = rssArticles.items;

    let cache = await db.get('articlesArray');

    //if linkID is already there, return this function and go again

    //     for (let article of articles) {
    //       const isCached = 
    //   }

    // await addArticleToCache(linkID);
    // return articles;
};

async function addArticleToCache(id) {
    await db.push('articlesArray', id);
    let cache = await db.get('articlesArray');
    if (cache.length > 60) {
        cache.splice(0, 30);
        await db.set('articlesArray', cache);
    }
}


getUniqueArticle();
let cachedArticles = [];
let lastModified = null;

async function fetchRssFeed(feedUrl) {
    const headers = {};

    if (lastModified) {
        headers['If-Modified-Since'] = lastModified;
    }

    const response = await fetch(feedUrl, { headers });

    if (response.status === 304) {
        // The feed has not been modified since our last request
        return [];
    }

    if (!response.ok) {
        // Error occurred while fetching the feed
        console.error('Error fetching the RSS feed:', response.status);
        return [];
    }

    lastModified = response.headers.get('Last-Modified');
    console.log(lastModified);
    const feedText = await response.text();
    const feed = await new Parser().parseString(feedText);

    // Filter out articles that are already in the cache
    const newArticles = feed.items.filter((item) => !cachedArticles.includes(item.link));

    // Update the cache with new articles
    cachedArticles.push(...newArticles.map((item) => item.link));

    return newArticles;
}

async function fetchOneUniqueArticle(feedUrl) {
    const newArticles = await fetchRssFeed(feedUrl);

    if (newArticles.length === 0) {
        return null;
    }

    // Return the first unique article found
    console.log(newArticles[0]);
    return newArticles[0];
}





setInterval(async () => {
    fetchOneUniqueArticle(rssFeeds.yahoo);
}, 3000);


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