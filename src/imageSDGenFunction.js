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


function removeLetters(inputString) {
    const stringWithoutLetters = inputString.replace(/[a-zA-Z]/g, '');
    return parseInt(stringWithoutLetters, 10);
}



async function chatWithAi(args, message, user) {

    try {


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
                negativePrompts.push(arg.slice(2)); // Remove the -- prefix
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
                    text_prompts,
                    cfg_scale: 7,
                    clip_guidance_preset: 'FAST_BLUE',
                    height: 512,
                    width: 512,
                    seed: mySeed ? mySeed : 0,
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