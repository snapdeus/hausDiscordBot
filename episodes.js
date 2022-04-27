require('dotenv').config();
const axios = require('axios')
const apiKey = process.env.TRANSISTOR_API_KEY;
const config = { headers: { 'x-api-key': apiKey } }

const getNumOfEps = async () => {
    try {
        const res = await axios.get('https://api.transistor.fm/v1/episodes', config)
        return res.data.data[0].attributes.number;
    } catch (e) {
        console.log(e);
    }
};
module.exports.getRandomShow = async () => {

    const numEps = await getNumOfEps()
    let randomNumber = Math.floor(Math.random() * numEps);
    try {
        const url = `https://api.transistor.fm/v1/episodes?pagination[page]=1&pagination[per]=` + `${ numEps }`
        const res = await axios.get(url, config)
        // console.log(res.data.data[randomNumber].id)
        const episode = res.data.data[randomNumber]
        return { episode, numEps };
    } catch (e) {
        console.log(e);
    }
};


