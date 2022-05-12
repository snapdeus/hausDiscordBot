require('dotenv').config()
const ObjectID = require('mongodb').ObjectId;
const GayComic = require('../models/gayComics')
const Discord = require('discord.js')

module.exports = {
    name: 'totalcomics',
    description: 'get total comics',

    async execute(client, message, args) {




        const totalComics = async () => {
            try {
                const maxNumber = await GayComic.findOne({})
                    .sort({ ordinality: -1 })
                const totalGayComics = maxNumber.ordinality




                message.channel.send(`Current Total Comics: ${ totalGayComics }`);

            } catch (e) {
                console.log(e)
            }
        }
        totalComics();
    }
}
