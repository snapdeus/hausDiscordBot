
const { createRandomPhrase, makeUniqueGreeting } = require('../utils/phraseFunctions')


module.exports = {
    name: 'phrase',
    description: 'generates a phrase',

    async execute(client, message, args) {
        message.channel.send(`${ await createRandomPhrase() }`);

    }
}