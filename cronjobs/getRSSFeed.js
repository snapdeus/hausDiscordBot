require('dotenv').config();


const Discord = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const Parser = require('rss-parser');
const parser = new Parser();
const { https, http } = require('follow-redirects');
const axios = require;
const { v3: uuidv3 } = require('uuid');

const fetch = require('node-fetch');



const MY_NAMESPACE = 'ed000fe2-da29-11ed-afa1-0242ac120002';
// const aba = uuidv3("HELLO STEPHEN", MY_NAMESPACE);
// const bab = uuidv3("HELLO STEPHEN", MY_NAMESPACE);



const rssFeeds = {
    ap: 'https://rsshub.app/apnews/topics/apf-topnews',
    yahoo: 'https://www.yahoo.com/news/rss',
    nyt: 'https://rsshub.app/nytimes/dual',
    bbc: 'http://feeds.bbci.co.uk/news/rss.xml?edition=us#'

};


const getUniqueArticle = async () => {
    //check db for cache and create if doesn't exist
    if (!db.has('articlesArray')) {
        db.set('articlesArray', [0]);
    }

    //get article

    let rssArticles = await parser.parseURL('https://rsshub.app/nytimes/dual');
    const link = rssArticles.items[0];
    //set link id
    // const linkID = uuidv3(link, MY_NAMESPACE);
    // let cache = db.get('articlesArray');
    // //if linkID is already there, return this function and go again
    // if (cache.includes(linkID)) {
    //     return generateRandom();
    // }
    console.log(link);

    // addArticleToCache(linkID);
    // return rssArticle;
};

getUniqueArticle();

function addArticleToCache(id) {
    db.push('articlesArray', id);
    let cache = db.get('articlesArray');
    if (cache.length > 100) {
        cache.shift();
        db.set('articlesArray', cache);
    }
}


module.exports.getNewsArticle = async () => {
    try {





        //create embed
        const embedMsg = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(``)
            .setURL(``)
            .setImage(``);

        return { embedMsg };

    } catch (e) {
        console.dir(e, { depth: 8 });
    }
};