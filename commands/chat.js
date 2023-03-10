
const { chatWithAi } = require('../src/chatFunctions')
const User = require('../models/user')

const allowedRoles = ['973978697910599781', '974050213075513405', '973348302055682088', '954022194520932393', '954012026039070741', '973619573754564648', '954034692598951976', '953988101859049553', '973620158423781496', '968476411474112533', '972920088061694053', '1083503275447423146']


const talkedRecently = new Set();

module.exports = {
    name: 'chat',
    description: 'chat with user',

    async execute(client, message, args, member) {
        const username = message.author.username;
        const userId = message.author.id;
        const guildId = message.guild.id;

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

        if (message.channel.id !== '975202962173485186') {
            message.channel.send("Please chat with the ai in the 'ai-chat' channel.");
            return
        }

        let role = member._roles[0]

        if (args.length > 200) {
            message.channel.send(`Please limit the length your prompt to 200 characters.`);
            return
        }

        if (allowedRoles.includes(role) || user.xpOverTime > 1000) {
            if (talkedRecently.has(message.author.id)) {
                message.channel.send("Please wait 30s before issuing another prompt.")
            } else {
                try {
                    message.channel.send(`${ await chatWithAi(args, message, user) }`);
                } catch (e) {
                    message.channel.send(`ERROR`);
                    console.log(e)
                }

                talkedRecently.add(message.author.id);
                setTimeout(() => {
                    // Removes the user from the set after a minute
                    talkedRecently.delete(message.author.id);
                }, 30000);

            }



        } else {
            message.channel.send(`You do not currently have permission to chat with me.`);
        }
    }
}