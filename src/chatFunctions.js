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



        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            max_tokens: 500,
            messages: [
                { role: "system", content: `You are a helpful assistant named hausBot, speaking with ${ username }` },
                { role: "assistant", content: user.memories.join(" ") },
                { role: "user", content: prompt }
            ],
        });

        user.memories.push(prompt)
        user.memories.push(completion.data.choices[0].message.content)
        if (user.memories.length > 20) {
            user.memories.shift()
        }

        await user.save()


        console.log(user)


        return completion.data.choices[0].message.content

    } catch (e) {
        console.log(`api error ${ e }`)
    }

}

module.exports = { chatWithAi }