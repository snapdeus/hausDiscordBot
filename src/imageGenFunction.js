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
        // const prompt = "a duck wearing socks";

        const completion = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,

        });


        const chatResponse = completion.data[0].url;
        console.log(chatResponse);

        return chatResponse;

    } catch (e) {
        console.log(`api error ${ e }`);
        return e;
    }

}


module.exports = { chatWithAi };