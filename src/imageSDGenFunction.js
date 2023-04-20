require('dotenv').config();
const User = require('../models/user');
// const { Configuration, OpenAIApi } = require("openai");
const Discord = require('discord.js');
const axios = require('axios')
const fetch = require('node-fetch')
const fs = require('fs')
const apiKey = process.env.STABILITY_API_KEY

const config = { headers: { Authorization: `Bearer ${ apiKey }` } }

const engineId = 'stable-diffusion-v1-5'
const url = `https://api.stability.ai/v1/generation/${ engineId }/text-to-image`



//below currently works
// const imageBuffer = await axios.get(url, { responseType: 'arraybuffer' })
//     .then((response) => {
//         const buffer = new Buffer.from(response.data)
//         buffer.name = 'image.png'
//         return buffer
//     })
//     .catch((error) => {
//         console.error('An error occurred while downloading the file:', error);
//     });

// console.log(imageBuffer)

async function chatWithAi(args, message, user) {
    // const initiliazing = "Initializing...";
    // const username = message.author.username;
    // const userId = message.author.id;
    // const guildId = message.guild.id;


    try {

        // const prompt = args.join(' ');


        const response = await fetch(
            `https://api.stability.ai/v1/generation/${ engineId }/text-to-image`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${ apiKey }`,
                },
                body: JSON.stringify({
                    text_prompts: [
                        {
                            text: `${ args }`,
                        },
                        {
                            text: `a very large dog`,
                        },
                    ],
                    cfg_scale: 7,
                    clip_guidance_preset: 'FAST_BLUE',
                    height: 512,
                    width: 512,
                    samples: 1,
                    steps: 50,
                }),
            }
        )

        if (!response.ok) {
            throw new Error(`Non-200 response: ${ await response.text() }`);
        }
        const responseJSON = await response.json();


        return Buffer.from(responseJSON.artifacts[0].base64, 'base64')
    } catch (e) {
        console.log(`api error ${ e }`);
        return e;
    }

}



module.exports = { chatWithAi };