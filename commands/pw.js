require('dotenv').config();

const Discord = require('discord.js');
function isValidHttpUrl(string) {
    let url;
    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
}

module.exports = {
    name: 'pw',
    description: 'get archive.is link',

    async execute(client, message, args) {


        if (!args.length) {
            return message.channel.send('Pleave provide a url');
        }

        if (!isValidHttpUrl(args[0])) {
            return message.channel.send('Please use valid url. Make sure it starts with https or http and ends with a valid TLD');
        }
        message.channel.send(`Here is an attempt at bypassing a paywall.\nhttps://1ft.io/${ args[0] }`);


    }
};
