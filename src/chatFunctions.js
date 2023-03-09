require('dotenv').config()
const User = require('../models/user')
const { Configuration, OpenAIApi } = require("openai");
const Discord = require('discord.js');



const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);





async function chatWithAi(args, message) {
    const initiliazing = "Initializing..."
    const username = message.author.username;
    const userId = message.author.id;
    const guildId = message.guild.id;

    const user = await User.findOne({ userId: userId })
    if (!user) {
        const user = new User({
            username: `${ username }`,
            userId: `${ userId }`,
            guildId: `${ guildId }`,
            memories: [],
        })
        await user.save()
        return initiliazing;
    }

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
        const chatResponse = completion.data.choices[0].message.content
        let modifiedResponse;


        if (chatResponse.length > 400) {
            modifiedResponse = chatResponse.slice(0, 200)
            user.memories.push(modifiedResponse)
        } else {
            user.memories.push(chatResponse)
        }

        if (user.memories.length > 8) {
            console.log('TOO LONG', user.memories)
            let tooManyMemories = user.memories.slice(-8);
            console.log(tooManyMemories)
            user.memories = tooManyMemories;
            await user.save()
            console.log(completion.data, user.memories.length)
            return chatResponse
        }

        await user.save()
        console.log('NOT TOO LONG', completion.data, user.memories.length)
        return chatResponse

    } catch (e) {
        console.log(`api error ${ e }`)
    }

}

module.exports = { chatWithAi }