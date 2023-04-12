require('dotenv').config()
const User = require('../models/user')
const { Configuration, OpenAIApi } = require("openai");
const Discord = require('discord.js');
const PNG = require("pngjs").PNG;
const fs = require('fs')
const path = require('path')
const dir = path.join(__dirname)
const fetch = require('node-fetch')
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);




async function chatWithAi(args, message, user) {
    const initiliazing = "Initializing..."
    const username = message.author.username;
    const userId = message.author.id;
    const guildId = message.guild.id;

    const https = require('https');

    try {

        const prompt = args.join(' ')
        const url = message.attachments.first()?.url


        const imageUrl = message.attachments.first()?.url // Replace this with your actual image URL
        const outputFilePath = './image.png'; // Replace this with your desired output file path

        await fetch(imageUrl)
            .then((response) => response.buffer())
            .then((buffer) => {
                fs.writeFile(outputFilePath, buffer, (err) => {
                    if (err) {
                        console.error('Error writing file:', err);
                        return;
                    }
                    console.log('Image saved successfully');
                });
            })
            .catch((error) => {
                console.error('Error fetching image:', error);
            });

        const completion = await openai.createImageEdit(
            fs.createReadStream('./image.png'),
            prompt,
            "256x256"
        );
        const chatResponse = completion.data.data
        console.log(chatResponse)
        return chatResponse



        // const completion = await openai.createImageEdit(
        //     fs.createReadStream(path.join(dir, "otter.png")),
        //     prompt,
        //     "256x256"
        // );




    } catch (e) {
        console.dir(e.response.data.error)
        return
        // e.response.data.error.message

    }

}

module.exports = { chatWithAi }