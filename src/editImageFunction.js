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


const width = 512;
const height = 512;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');
async function loadImageAndDraw(imagePath) {
    const image = await loadImage(imagePath);
    ctx.drawImage(image, 0, 0, 512, 512);
}


async function chatWithAi(args, message, user) {
    const initiliazing = "Initializing...";
    const username = message.author.username;
    const userId = message.author.id;
    const guildId = message.guild.id;

    const goodUrl = 'https://i.imgur.com/GLpGEhT.png';

    try {
        console.log('trying..........');
        const prompt = args.join(' ');
        const url = message.attachments.first()?.url;
        const mask = fs.createReadStream(path.join(dir, "mask.png"));
        await loadImageAndDraw(url);
        const canvasBuffer = canvas.toBuffer('image/png');
        canvasBuffer.name = 'image.png';
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

        console.log(prompt);
        const completion = await openai.createImageEdit(
            canvasBuffer,
            prompt,
            fs.createReadStream(path.join(dir, "mask.png")),
            1,
            "512x512"
        );


        //ORDER FOR NO MASK
        // const completion = await openai.createImageEdit(
        //     imageBuffer,
        //     prompt,
        //     "512x512"
        // );

        //ORDER FOR MASK
        // const completion = await openai.createImageEdit(
        //     imageBuffer,
        //     prompt,
        //     mask,
        //     1,
        //     "512x512"
        // );

        //VARIATION
        // const completion = await openai.createImageVariation(
        //     imageBuffer,
        //     1,
        //     "512x512"
        // );


        const chatResponse = completion.data.data;
        console.log(chatResponse);
        return chatResponse;



    } catch (e) {
        console.dir(e.response.data.error.message);
        const errorObject = { url: e.response.data.error.message };
        return [errorObject];
        // e.response.data.error.message

    }

}

module.exports = { chatWithAi };