const Discord = require('discord.js');
const { jackingOff, starter } = require('../resources/jacking')


module.exports = {
    name: 'jackoff',
    description: 'jacks off',

    async execute(client, message, args) {
        let phrase = jackingOff[Math.floor(Math.random() * jackingOff.length)];
        let intro = starter[Math.floor(Math.random() * starter.length)]
        message.channel.send(`${ intro } ${ phrase.toLowerCase() }`);

    }
}
