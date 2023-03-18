require('dotenv').config()
const User = require('../models/user')
const { Configuration, OpenAIApi } = require("openai");
const Discord = require('discord.js');



const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);





async function chatWithAi(args, message, user) {
    const initiliazing = "Initializing..."
    const username = message.author.username;
    const userId = message.author.id;
    const guildId = message.guild.id;


    try {

        const prompt = args.join(' ')

        user.memories.push(prompt)

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            max_tokens: 400,
            temperature: 0.7,
            messages: [
                { role: "system", content: `You are a helpful assistant named hausBot, speaking with ${ username }` },
                { role: "assistant", content: user.memories.join(" ") },
                { role: "user", content: prompt }
            ],
        });

        // console.log(completion)
        const chatResponse = completion.data.choices[0].message.content
        let modifiedResponse;


        if (chatResponse.length > 400) {
            modifiedResponse = chatResponse.slice(0, 200)
            user.memories.push(modifiedResponse)
        } else {
            user.memories.push(chatResponse)
        }

        if (user.memories.length > 8) {

            let tooManyMemories = user.memories.slice(-8);

            user.memories = tooManyMemories;
            await user.save()

            return chatResponse
        }

        await user.save()

        return chatResponse

    } catch (e) {
        console.log(`api error ${ e }`)
    }

}

module.exports = { chatWithAi }