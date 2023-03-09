require('dotenv').config()

const { Configuration, OpenAIApi } = require("openai");
const Discord = require('discord.js');



const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


const memory = [];



async function chatWithAi(args, username) {
    if (memory.length > 6) {
        memory.shift();
    }

    try {

        const prompt = args.join(' ')

        memory.push(prompt)

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            max_tokens: 500,
            messages: [
                { role: "system", content: `You are a helpful assistant named hausBot, speaking with ${ username }` },
                { role: "assistant", content: memory.join(" ") },
                { role: "user", content: prompt }
            ],
        });

        memory.push(completion.data.choices[0].message.content)


        return completion.data.choices[0].message.content

    } catch (e) {
        console.log(`api error ${ e }`)
    }

}

module.exports = { chatWithAi }