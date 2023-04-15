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


const testDB = db.table('testDB');
const testcachedDB = db.table('testcachedDB');
const rssFeeds = {
    guardian: {
        name: "guardian",
        url: "https://www.theguardian.com/us/rss",
    },

    dw: {
        name: "dw",
        url: 'https://rsshub.app/dw/en'
    },
}



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const fetchAndParseFeed = async (feedObj) => {
    let feedUrl = feedObj.url
    let feedName = feedObj.name;
    try {
        const previousLastModified = await testcachedDB.get(feedName);

        const fetchOptions = feedName === "guardian" ? { headers: { 'If-None-Match': previousLastModified ? previousLastModified : '' } } : { headers: { 'If-Modified-Since': previousLastModified ? previousLastModified : '' } }

        console.log(fetchOptions)

        const response = await fetch(feedUrl, fetchOptions);


        //return if there were no modifications
        if (response.status === 304) {
            console.log('no modificatoins!!!!!!!')
            return;
        }


        //set new timestamp and put in db
        const lastModified = response.headers.get('Last-Modified') || response.headers.get('etag');

        if (lastModified) {
            await testcachedDB.set(feedName, lastModified);
        }
        console.log(lastModified)
        //get the full feed of all articles and parse it
        // const feed = await parser.parseURL(feedUrl);
        // const articles = feed.items;

        // console.log(articles[0].title)
    } catch (error) {
        console.log(`Error fetching or parsing the feed: ${ error }`);
    }

};

fetchAndParseFeed(rssFeeds.guardian)
// const createArticleLinks = async (feeds) => {
//     try {
//         let linkArray = [];
//         //for every news source, attempt to get article
//         for (const feedUrl of Object.values(feeds)) {
//             const newArticle = await fetchAndParseFeed(feedUrl);
//             //if successful, add article to db
//             if (newArticle) {
//                 const sanitizedFeedUrl = newArticle.link.replace(/\./g, "__dot__");
//                 //check if exists in db already
//                 if (!(await articlesDB.get(sanitizedFeedUrl))) {
//                     linkArray.push(newArticle.link);
//                     await articlesDB.set(sanitizedFeedUrl, true);
//                 }
//             }
//         }
//         //return array of articles to send to channel
//         return linkArray;
//     } catch (error) {
//         console.error(error);
//     }

// };



