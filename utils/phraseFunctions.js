const { business } = require('../resources/business')
const { byPrepo } = require('../resources/byPrepo')
const { conversational } = require('../resources/conversational')
const { felicitous } = require('../resources/felicitous')
const { greetings } = require('../resources/greetings')
const { impressive } = require('../resources/impressive')
const { inPrepo } = require('../resources/inPrepo')
const { intoPrepo } = require('../resources/intoPrepo')
const { literary } = require('../resources/literary')
const { misc } = require('../resources/misc')
const { ofPrepo } = require('../resources/ofPrepo')
const { publicSpeaking } = require('../resources/publicSpeaking')
const { significant } = require('../resources/significant')
const { similies } = require('../resources/similies')
const { toPrepo } = require('../resources/toPrepo')
const { useful } = require('../resources/useful')
const { withPrepo } = require('../resources/withPrepo')


const Discord = require('discord.js');


makeUniqueGreeting = () => {
    let randomGreetings = greetings[Math.floor(Math.random() * greetings.length)]
    return randomGreetings
}


async function createRandomPhrase() {

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const sentenceStarters = {
        phrase1: business[Math.floor(Math.random() * business.length)],
        phrase2: literary[Math.floor(Math.random() * literary.length)],
        phrase3: misc[Math.floor(Math.random() * misc.length)],
        phrase4: similies[Math.floor(Math.random() * similies.length)],
    };
    const sentenceEnders = {
        phrase1: conversational[Math.floor(Math.random() * conversational.length)],
        phrase2: useful[Math.floor(Math.random() * useful.length)],
        phrase3: publicSpeaking[Math.floor(Math.random() * publicSpeaking.length)],
    };
    const middleSentence = {
        phrase1: inPrepo[Math.floor(Math.random() * inPrepo.length)],
        phrase2: intoPrepo[Math.floor(Math.random() * intoPrepo.length)],
        phrase3: toPrepo[Math.floor(Math.random() * toPrepo.length)],
        phrase4: withPrepo[Math.floor(Math.random() * withPrepo.length)],
        phrase5: byPrepo[Math.floor(Math.random() * byPrepo.length)],
        phrase6: ofPrepo[Math.floor(Math.random() * ofPrepo.length)],

    };
    const describers = {
        phrase1: felicitous[Math.floor(Math.random() * felicitous.length)],
        phrase2: impressive[Math.floor(Math.random() * impressive.length)],
        phrase3: significant[Math.floor(Math.random() * significant.length)],
    };


    let randomPhrases = [];
    let numStart = 'phrase' + Math.ceil((Math.random() * 4))
    let numMiddle = 'phrase' + Math.ceil((Math.random() * 6))
    let numDescriber = 'phrase' + Math.ceil((Math.random() * 3))
    let numEnder = 'phrase' + Math.ceil((Math.random() * 3))
    let comma = ','
    let period = '.'
    randomPhrases.push(
        sentenceStarters[numStart].toLowerCase().concat(comma),

        middleSentence[numMiddle].toLowerCase(),
        describers[numDescriber].toLowerCase().concat(comma),

        sentenceEnders[numEnder].toLowerCase().concat(period)
    )

    console.log(randomPhrases)


    let phraseArray = [];
    let payload;

    for (phrase of randomPhrases) {
        phraseArray.push(phrase)
        payload = phraseArray.join(' ').replace(/\bi\b/g, 'I')

    }

    return capitalizeFirstLetter(payload)
}




module.exports = { createRandomPhrase, makeUniqueGreeting }


  //old way with interesting Set
    // let array = []
    // for (let i = 0; i < 4; i++) {
    //     let num = Math.ceil((Math.random() * 16))
    //     let filename = 'phrase' + num
    //     array.push(filename)
    // }
    // let randomPhrases = Array.from(new Set(array))
    // if (randomPhrases.length < 5) {
    //     return createRandomPhrase()
    // }