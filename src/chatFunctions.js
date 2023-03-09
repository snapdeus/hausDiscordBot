require('dotenv').config()

const { Configuration, OpenAIApi } = require("openai");
const Discord = require('discord.js');



const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


const memory = [];



async function chatWithAi(args) {
    if (memory.length > 5) {
        memory.shift();
    }
    console.log(memory)
    try {

        const prompt = args.join(' ')
        memory.push(prompt)

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            max_tokens: 500,
            messages: [
                { role: "system", content: "You are a helpful assistant named hausBot." },
                { role: "assistant", content: memory.join(" ") },
                { role: "user", content: prompt }
            ],
        });
        console.log(completion.data)
        memory.push(completion.data.choices[0].message.content)
        return completion.data.choices[0].message.content

    } catch (e) {
        console.log(`api error ${ e }`)
    }

}

module.exports = { chatWithAi }