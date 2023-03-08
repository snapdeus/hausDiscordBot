
const { chatWithAi } = require('../src/chatFunctions')

const allowedRoles = ['973978697910599781', '974050213075513405', '973348302055682088', '954022194520932393', '954012026039070741', '973619573754564648', '954034692598951976', '953988101859049553', '973620158423781496', '968476411474112533']


const talkedRecently = new Set();

module.exports = {
    name: 'chat',
    description: 'chat with user',

    async execute(client, message, args, member) {
        let role = member._roles[0]

        if (args.length > 140) {
            message.channel.send(`Please limit the length your prompt to 140 characters.`);
            return
        }

        if (allowedRoles.includes(role)) {
            if (talkedRecently.has(message.author.id)) {
                message.channel.send("Please wait 1 minute before issuing another prompt.")
            } else {
                try {
                    message.channel.send(`${ await chatWithAi(args) }`);
                } catch {
                    message.channel.send(`ERROR`);
                    console.log('chatgpt error')
                }
                talkedRecently.add(message.author.id);
                setTimeout(() => {
                    // Removes the user from the set after a minute
                    talkedRecently.delete(message.author.id);
                }, 60000);
            }



        } else {
            message.channel.send(`You do not have permission to chat with me.`);
        }
    }
}