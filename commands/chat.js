
const { chatWithAi } = require('../src/chatFunctions')
const Memory = require('../models/memoryBank')
const User = require('../models/user')
const { v4: uuidv4 } = require('uuid');


const allowedRoles = ['973978697910599781', '974050213075513405', '973348302055682088', '954022194520932393', '954012026039070741', '973619573754564648', '954034692598951976', '953988101859049553', '973620158423781496', '968476411474112533', '972920088061694053', '1083503275447423146', '974050213075513405']


const talkedRecently = new Set();

function splitMessage(message, maxLength = 2000) {
    const messageChunks = [];
    for (let i = 0; i < message.length; i += maxLength) {
        messageChunks.push(message.slice(i, i + maxLength));
    }
    return messageChunks;
}
module.exports = {
    name: 'chat',
    description: 'chat with user',

    async execute(client, message, args, member) {
        const username = message.author.username;
        const userId = message.author.id;
        const guildId = message.guild.id;

        // FIND USER IN DB
        const user = await User.findOne({ userId: userId })
        if (!user) {
            const user = new User({
                username: `${ username }`,
                userId: `${ userId }`,
                guildId: `${ guildId }`,
                xpOverTime: 0,
                memories: [],
            })
            await user.save()
            return "Initializing...";
        }

        // INITIALIZE MEMORY THE FIRST TIME
        //PUT THIS IN SEEDS FILE
        // await Memory.deleteMany({})
        const memory = await Memory.findOne({})
        if (!memory) {
            const memory = new Memory({
                memories: [
                    {
                        memoryId: uuidv4(),
                        userStatement: "",
                        aiStatement: "",
                        userId: "",
                        userName: "",
                        aiName: "",
                    }

                ]
            })

            await memory.save()
            return message.channel.send("Initializing memory...please wait 1 second and try again.");
        }

        if (message.channel.id !== '975202962173485186' && message.channel.id !== '884434543543726134') {
            message.channel.send("Please chat with the ai in the 'ai-chat' channel.");
            return
        }

        let role = member._roles[0]

        if (args.length > 750) {
            message.channel.send(`Please limit the length your prompt to 750 characters.`);
            return
        }

        if (allowedRoles.includes(role) || user.xpOverTime > 1000) {
            if (talkedRecently.has(message.author.id)) {
                message.channel.send("Please wait 5s before issuing another prompt.")
            } else {
                try {
                    const chatBot = client.user.username;
                    const chatResponse = await chatWithAi(args, message, memory, chatBot)

                    if (chatResponse.length > 2000) {

                        const messageChunks = splitMessage(chatResponse);

                        messageChunks.forEach(chunk => {
                            message.channel.send(`${ chunk }`);
                        });

                    } else {
                        message.channel.send(`${ chatResponse }`);
                    }


                } catch (e) {
                    message.channel.send(`ERROR`);
                    console.log(e)
                }

                talkedRecently.add(message.author.id);
                setTimeout(() => {
                    // Removes the user from the set after a minute
                    talkedRecently.delete(message.author.id);
                }, 5000);

            }



        } else {
            message.channel.send(`You do not currently have permission to chat with me. Please acquire 🪙500 Haus Coins`);
        }
    }
}