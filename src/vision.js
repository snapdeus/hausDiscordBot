require('dotenv').config();
const User = require('../models/user');
const { OpenAI } = require("openai");
const Discord = require('discord.js');

const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname);
const PNG = require("pngjs").PNG;

const { createCanvas, loadImage, Image } = require('canvas');

const axios = require('axios');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
});





async function chatWithAi(args, message, user) {
    const initiliazing = "Initializing...";
    const username = message.author.username;
    const userId = message.author.id;
    const guildId = message.guild.id;



    try {


        const url = message.attachments.first()?.url;
        const prompt = args.join(' ');

        const response = await openai.chat.completions.create({
            model: "gpt-4-vision-preview",
            max_tokens: 4096,
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompt !== ' ' ? prompt : "What’s in this image?" },
                        {
                            type: "image_url",
                            image_url:
                                url,
                        },
                    ],
                },
            ],
        });
        // console.log(response.choices);

        const chatResponse = response.choices[0];

        return chatResponse;



    } catch (e) {
        console.dir(e.response.data.error.message);
        const errorObject = { url: e.response.data.error.message };
        return [errorObject];
        // e.response.data.error.message

    }

}

module.exports = { chatWithAi };

// async function main() {
//     const response = await openai.chat.completions.create({
//         model: "gpt-4-vision-preview",
//         messages: [
//             {
//                 role: "user",
//                 content: [
//                     { type: "text", text: "What’s in this image?" },
//                     {
//                         type: "image_url",
//                         image_url:
//                             "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
//                     },
//                 ],
//             },
//         ],
//     });
//     console.log(response.choices[0]);
// }
// main();