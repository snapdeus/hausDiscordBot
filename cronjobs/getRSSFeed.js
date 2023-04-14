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
// const aba = uuidv3("HELLO STEPHEN", MY_NAMESPACE);
// const bab = uuidv3("HELLO STEPHEN", MY_NAMESPACE);



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

    let rssArticles = await parser.parseURL(rssFeeds.ap);
    const articles = rssArticles.items;
    //set link id
    // const linkID = uuidv3(article.link, MY_NAMESPACE);
    for (let article of articles) {
        console.log(article.pubDate);
    }
    // let cache = await db.get('articlesArray');
    // console.log(cache);
    // //if linkID is already there, return this function and go again
    // if (cache.includes(linkID)) {
    //     return await getUniqueArticle();
    // }


    // await addArticleToCache(linkID);
    // return article;
};



async function addArticleToCache(id) {
    await db.push('articlesArray', id);
    let cache = db.get('articlesArray');
    if (cache.length > 100) {
        cache.shift();
        await db.set('articlesArray', cache);
    }
}

getUniqueArticle();

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
        console.dir(e, { depth: 8 });
    }
};