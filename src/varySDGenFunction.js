require('dotenv').config();
const User = require('../models/user');
// const { Configuration, OpenAIApi } = require("openai");
const Discord = require('discord.js');
const axios = require('axios');
const fetch = require('node-fetch');
const fs = require('fs');
const apiKey = process.env.STABILITY_API_KEY;
const path = require('path');
const config = { headers: { Authorization: `Bearer ${ apiKey }` } };
const { createCanvas, loadImage, Image } = require('canvas');
const engineId = 'stable-diffusion-512-v2-1';
const FormData = require('form-data');

function removeLetters(inputString) {
    const stringWithoutLetters = inputString.replace(/[a-zA-Z]/g, '');
    return parseInt(stringWithoutLetters, 10);
}

const width = 512;
const height = 512;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');
async function loadImageAndDraw(imagePath) {
    const image = await loadImage(imagePath);
    ctx.drawImage(image, 0, 0, 512, 512);
}



async function chatWithAi(args, message, user) {

    try {
        const url = message.attachments.first()?.url;

        await loadImageAndDraw(url);
        const canvasBuffer = canvas.toBuffer('image/png');
        canvasBuffer.name = 'image.png';

        let mySeed = null;
        let negativePrompts = [];
        let prompts = [];



        args.forEach(arg => {
            if (arg.startsWith('$')) {
                if (mySeed) {
                    throw new Error('More than one seed found. Please provide only one seed.');
                }
                mySeed = removeLetters(arg.slice(1)); // Remove the $ sign
            } else if (arg.startsWith('-')) {
                negativePrompts.push(arg.slice(1)); // Remove the - prefix
            } else {
                prompts.push(arg);
            }
        });

        if (prompts.length === 0) {
            throw new Error('No prompts found. Please provide at least one prompt.');
        }

        let text_prompts = [
            {
                text: `${ prompts }`,
                weight: 1
            }
        ];

        if (negativePrompts.length > 0) {
            text_prompts.push({
                text: `${ negativePrompts }`,
                weight: -1
            });
        }



        const formData = new FormData();
        formData.append('init_image', canvasBuffer);
        formData.append('init_image_mode', 'IMAGE_STRENGTH');
        formData.append('image_strength', 0.7);
        formData.append('text_prompts[0][text]', text_prompts[0]['text']);
        formData.append('text_prompts[0][weight]', text_prompts[0]['weight']);
        if (text_prompts.length > 1) {
            formData.append('text_prompts[1][text]', text_prompts[1]['text']);
            formData.append('text_prompts[1][weight]', text_prompts[1]['weight']);
        }

        formData.append('cfg_scale', 8);
        formData.append('clip_guidance_preset', 'FAST_BLUE');
        formData.append('samples', 1);
        formData.append('steps', 75);
        formData.append('seed', mySeed ? mySeed : 0);



        const response = await fetch(
            `https://api.stability.ai/v1/generation/${ engineId }/image-to-image`,
            {
                method: 'POST',
                headers: {
                    ...formData.getHeaders(),
                    Accept: 'application/json',
                    Authorization: `Bearer ${ apiKey }`,
                },
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error(`Non-200 response: ${ await response.text() }`);
        }
        const responseJSON = await response.json();
        const chatResponse = {
            buffer: Buffer.from(responseJSON.artifacts[0].base64, 'base64'),
            seed: mySeed ? mySeed : 0,
            prompts: prompts.join(" "),
            negativePrompts: negativePrompts.length > 0 ? negativePrompts.join(" ") : "N/A"
        };
        return chatResponse;
    } catch (e) {
        console.log(`api error ${ e }`);
        return e;
    }

}



module.exports = { chatWithAi };