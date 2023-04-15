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
let config;
let botId;
if (process.env.NODE_ENV?.trim() === 'development') {
    config = require('../config/config.test.json');
    botId = '884512701798285372';
} else {
    botId = '968597421435256846';
    config = require('../config/config.json');
}



const articlesDB = db.table('articles');
const cachedLastModifiedDB = db.table('lastModified');
const rssFeeds = {
    ap: {
        name: "ap",
        url: 'https://rsshub.app/apnews/topics/ap-top-news'
    },
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
    guardian: {
        name: "guardian",
        url: "https://www.theguardian.com/us/rss",
    },

};
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const fetchAndParseFeed = async (feedObj) => {
    let feedUrl = feedObj.url;
    let feedName = feedObj.name;
    try {

        //get previous timestamp
        const previousLastModified = await cachedLastModifiedDB.get(feedName);
        //set it as header, or empty if doesn't exist
        const fetchOptions = feedName === "guardian" ? { headers: { 'If-None-Match': previousLastModified ? previousLastModified : '' } } : { headers: { 'If-Modified-Since': previousLastModified ? previousLastModified : '' } }
        //do simple fetch first, to see if there were modifications
        const response = await fetch(feedUrl, fetchOptions);
        //return if there were no modifications
        if (response.status === 304) {
            return;
        }
        //set new timestamp and put in db
        const lastModified = response.headers.get('Last-Modified') || response.headers.get('etag');
        if (lastModified) {
            await cachedLastModifiedDB.set(feedName, lastModified);
        }
        //get the full feed of all articles and parse it
        const feed = await parser.parseURL(feedUrl);
        const articles = feed.items;

        //return only first article
        return articles[0];
    } catch (error) {
        console.log(`Error fetching or parsing the feed: ${ error }`);
    }

};


const createArticleLinks = async (feeds) => {
    try {
        let linkArray = [];
        //for every news source, attempt to get article
        for (const feedUrl of Object.values(feeds)) {
            const newArticle = await fetchAndParseFeed(feedUrl);
            //if successful, add article to db
            if (newArticle) {
                const sanitizedFeedUrl = newArticle.link.replace(/\./g, "__dot__");
                //check if exists in db already
                if (!(await articlesDB.get(sanitizedFeedUrl))) {
                    linkArray.push(newArticle.link);
                    await articlesDB.set(sanitizedFeedUrl, true);
                }
            }
        }
        //return array of articles to send to channel
        return linkArray;
    } catch (error) {
        console.error(error);
    }

};

module.exports.retrieveArticlesAndSend = async (client) => {

    const articleLinks = await createArticleLinks(rssFeeds);
    const channel = client.channels.cache.get(config.NEWS_CHANNEL);
    if (!articleLinks) {
        return;
    }
    for (link of articleLinks) {
        channel.send(link);
        sleep(500);
    }
};


