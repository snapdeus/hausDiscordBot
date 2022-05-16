
require('dotenv').config();
const axios = require('axios')
const apiKey = process.env.TRANSISTOR_API_KEY;
const config = { headers: { 'x-api-key': apiKey } }
const Discord = require('discord.js')
const db = require("quick.db");



const getRandomShow = async () => {


    try {
        const url = `https://api.transistor.fm/v1/episodes?pagination[page]=1&pagination[per]=` + `150`
        const res = await axios.get(url, config)

        console.log(res.data.data[50].attributes)


    } catch (e) {
        console.log(e);
    }
};

