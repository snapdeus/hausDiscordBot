
const { chatWithAi } = require('../src/varySDGenFunction');

const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');





const talkedRecently = new Set();

function splitMessage(message, maxLength = 2000) {
    const messageChunks = [];
    for (let i = 0; i < message.length; i += maxLength) {
        messageChunks.push(message.slice(i, i + maxLength));
    }
    return messageChunks;
}
module.exports = {
    name: 'varysd',
    description: 'vary image from stable diffusion',

    async execute(client, message, args, member) {

        return message.channel.send(`You do not currently have permission to chat with me. Please acquire Infinite Haus Coins`);
        const username = message.author.username;
        const userId = message.author.id;
        const guildId = message.guild.id;

        // FIND USER IN DB
        const user = await User.findOne({ userId: userId });
        if (!user) {
            const user = new User({
                username: `${ username }`,
                userId: `${ userId }`,
                guildId: `${ guildId }`,
                xpOverTime: 0,
                memories: [],
            });
            await user.save();
            return "Initializing...";
        }

        if (message.attachments.first()?.url === undefined) {
            message.reply("You must attach a file for this to work. No URL support yet...");
            return;
        }


        if (message.channel.id !== '975202962173485186' && message.channel.id !== '884434543543726134') {
            message.channel.send("Please chat with the ai in the 'ai-chat' channel.");
            return;
        }



        if (args.length > 2000) {
            message.channel.send(`Please limit the length your prompt to 2000 characters.`);
            return;
        }

        if (user.xpOverTime > 500) {
            if (talkedRecently.has(message.author.id)) {
                message.channel.send("Please wait 5s before issuing another prompt.");
            } else {
                try {
                    const chatBot = client.user.username;
                    const chatResponse = await chatWithAi(args, message, user, chatBot);

                    if (Buffer.isBuffer(chatResponse.buffer)) {
                        message.reply({
                            content: `Here ya go⁣ ${ username } \n Seed: ${ chatResponse.seed } \n Prompt: ${ chatResponse.prompts } \n Negative Prompts: ${ chatResponse.negativePrompts }`, files: [
                                { attachment: chatResponse.buffer }
                            ]
                        });
                    } else {
                        console.log(chatResponse);
                        message.reply({
                            content: `Hmmm,⁣ ${ username } \n ${ chatResponse }`,
                        });
                    }


                    user.xpOverTime = user.xpOverTime - 10;
                    await user.save();

                } catch (e) {
                    message.channel.send(`ERROR`);
                    console.log(e);
                }

                talkedRecently.add(message.author.id);
                setTimeout(() => {
                    // Removes the user from the set after a minute
                    talkedRecently.delete(message.author.id);
                }, 1000);

            }



        } else {
            message.channel.send(`You do not currently have permission to chat with me. Please acquire 🪙500 Haus Coins`);
        }
    }
};