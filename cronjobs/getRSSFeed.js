require('dotenv').config();



const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: `./json.sqlite` });
const Parser = require('rss-parser');
const parser = new Parser();

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
    nyt: {
        name: "nyt",
        url: "https://rss.nytimes.com/services/xml/rss/nyt/US.xml"
    }

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
        const fetchOptions = feedName === "guardian" ? { headers: { 'If-None-Match': previousLastModified ? previousLastModified : '' } } : { headers: { 'If-Modified-Since': previousLastModified ? previousLastModified : '' } };
        //do simple fetch first, to see if there were modifications
        const response = await fetch(feedUrl, fetchOptions);
        //return if there were no modifications
        if (response.status === 304) {
            return;
        }

        //get the full feed of all articles and parse it
        const feed = await parser.parseURL(feedUrl);
        //set new timestamp and put in db
        const lastModified = response.headers.get('Last-Modified') || response.headers.get('etag');

        if (lastModified) {
            await cachedLastModifiedDB.set(feedName, lastModified);
        }



        let articles;
        if (feedName === 'yahoo') {
            articles = feed.items.sort((a, b) => new Date(b.isoDate) - new Date(a.isoDate));
        } else if (feedName === 'nyt') {
            articles = feed.items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        } else {
            articles = feed.items;
        }

        // const articles = feedName === 'yahoo' ? feed.items.sort((a, b) => new Date(b.isoDate) - new Date(a.isoDate)) : feed.items;
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

async function deleteArticles() {
    const cachedArticles = await articlesDB.all();
    if (cachedArticles.length > 100) {
        for (let i = 0; i < 50; i++) {
            await articlesDB.delete(cachedArticles[i].id);
        }
        console.log("deleted some articles from rssFeedDB");
    }
}

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
    deleteArticles();
};


