require('dotenv').config()

const { Configuration, OpenAIApi } = require("openai");
const Discord = require('discord.js');



const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);




async function chatWithAi(args) {
    try {
        const prompt = args.join(' ')
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            max_tokens: 500,
            messages: [
                { role: "system", content: "You are a helpful assistant named hausBot." },
                { role: "user", content: prompt }
            ],
        });

        return completion.data.choices[0].message.content

    } catch (e) {
        console.log(`api error ${ e }`)
    }

}

module.exports = { chatWithAi }