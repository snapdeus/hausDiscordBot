
require('dotenv').config()
const User = require('../models/user')
const { Configuration, OpenAIApi } = require("openai");
const Discord = require('discord.js');

const fs = require('fs')
const path = require('path')
const dir = path.join(__dirname)
const PNG = require("pngjs").PNG;

const { createCanvas, loadImage, Image } = require('canvas')


const width = 256
const height = 256
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');
async function loadImageAndDraw(imagePath) {
    const image = await loadImage(imagePath);
    ctx.drawImage(image, 0, 0, 230, 230);
}

const url =

    async function generateStuff() {
        await loadImageAndDraw(url)
        const canvasBuffer = canvas.toBuffer('image/png')
        canvasBuffer.name = 'image.png'


    }

generateStuff();















// function splitMessage(message, maxLength = 20) {
//     const messageChunks = [];
//     for (let i = 0; i < message.length; i += maxLength) {
//         messageChunks.push(message.slice(i, i + maxLength));
//         console.log(messageChunks)
//     }
//     return messageChunks;
// }
// const latinText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

// splitMessage(latinText)
