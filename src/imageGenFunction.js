require('dotenv').config();
const User = require('../models/user');
const { OpenAI } = require("openai");
const Discord = require('discord.js');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
});



async function chatWithAi(args, message, user) {
    const initiliazing = "Initializing...";
    const username = message.author.username;
    const userId = message.author.id;
    const guildId = message.guild.id;


    try {

        const prompt = args.join(' ');


        const completion = await openai.createImage({
            prompt: prompt,
            n: 1,
            size: "512x512",
        });


        const chatResponse = completion.data.data[0].url;


        return chatResponse;

    } catch (e) {
        console.log(`api error ${ e.response.data.error.message }`);
        return e.response.data.error.message;
    }

}

module.exports = { chatWithAi };