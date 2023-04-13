require('dotenv').config()
const User = require('../models/user')
const { Configuration, OpenAIApi } = require("openai");
const Discord = require('discord.js');

const fs = require('fs')
const path = require('path')
const dir = path.join(__dirname)
const PNG = require("pngjs").PNG;

const { createCanvas, loadImage, Image } = require('canvas')

const axios = require('axios');
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


const width = 256
const height = 256
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');
async function loadImageAndDraw(imagePath) {
    const image = await loadImage(imagePath);
    ctx.drawImage(image, 0, 0, 256, 256);
}


async function chatWithAi(args, message, user) {
    const initiliazing = "Initializing..."
    const username = message.author.username;
    const userId = message.author.id;
    const guildId = message.guild.id;



    try {

        const prompt = args.join(' ')
        const url = message.attachments.first()?.url
        const mask = fs.createReadStream(path.join(dir, "mask.png"))
        await loadImageAndDraw(url)
        const canvasBuffer = canvas.toBuffer('image/png')
        canvasBuffer.name = 'image.png'





        const completion = await openai.createImageVariation(
            canvasBuffer,
            1,
            "256x256"
        );


        const chatResponse = completion.data.data

        return chatResponse



    } catch (e) {
        console.dir(e.response.data.error.message)
        const errorObject = { url: e.response.data.error.message }
        return [errorObject]
        // e.response.data.error.message

    }

}

module.exports = { chatWithAi }