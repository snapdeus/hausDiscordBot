
const { chatWithAi } = require('../src/vision');

const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');


const allowedRoles = ['973978697910599781', '974050213075513405', '973348302055682088', '954022194520932393', '954012026039070741', '973619573754564648', '954034692598951976', '953988101859049553', '973620158423781496', '968476411474112533', '972920088061694053', '1083503275447423146', '974050213075513405'];


const talkedRecently = new Set();

function splitMessage(message, maxLength = 2000) {
    const messageChunks = [];
    for (let i = 0; i < message.length; i += maxLength) {
        messageChunks.push(message.slice(i, i + maxLength));
    }
    return messageChunks;
}
module.exports = {
    name: 'vision',
    description: 'describe image',

    async execute(client, message, args, member) {



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
        977656125426106378;
        if (message.channel.id !== '977656125426106378' && message.channel.id !== '884434543543726134') {
            message.channel.send("Please chat with the ai in the 'ai-chat' channel.");
            return;
        }

        let role = member._roles[0];

        if (args.length > 2000) {
            message.channel.send(`Please limit the length your prompt to 2000 characters.`);
            return;
        }

        if (user.xpOverTime > 10000) {
            if (talkedRecently.has(message.author.id)) {
                message.channel.send("Please wait 5s before issuing another prompt.");
            } else {
                try {
                    const chatBot = client.user.username;

                    const chatResponse = await chatWithAi(args, message, user, chatBot);
                    console.log(chatResponse);

                    message.reply(`${ chatResponse.message.content }`);

                    user.xpOverTime = user.xpOverTime - 10000;
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
            message.channel.send(`You do not currently have permission to chat with me. Please acquire 🪙10000 Haus Coins`);
        }
    }
};