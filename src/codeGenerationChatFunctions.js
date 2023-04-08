require('dotenv').config()
const User = require('../models/user')
const { Configuration, OpenAIApi } = require("openai");
const Discord = require('discord.js');



const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


const systemContent = `
You will be generating code, for example a valid JSON array of objects for an RPG i'm making.
Global Buff Rule: 10% of the items you generate should have a special buff. The buffTypes are:  Attack,  Defense,  Magic Attack,  Magic Defense,  Evade,  Endurance,  HP,  AP. The amounts range between 5 and 50.
note this js function for later:Object.defineProperty(String.prototype, 'capitalize', { value: function() { return this.charAt(0).toUpperCase() + this.slice(1); },enumerable: false });
Please do not put quotation marks around the values for “Value”, “Weight” and “amount” because they are numbers, not strings. Generate all new items using obscure words.
the key Filename will start at: [[startnumber]]_[[Category]]_[[Type]]_[[Color]].png and will be incremented by 1.
item = the new object you are generating and a one word adjective that describes it Influence of medieval fantasy RPG..The description of the item is description=generate a description of the item using influences from other textRPG item sets.  The description should be around 25 words or less, and use archaic terms from medieval fantasy influences 
example description if does NOT contain a Buff: "A dashing [[item]] of obsidian glass for an autarch!"
example description if contains a Buff: "A dashing [[item]] reminiscent of a nenuphar that raises your evade by 80 points!"
Please remember that the Value should be higher when the item has a Buff.
Remember, only 10% of the items you generate should have buffs. If you find at the end that more than 10% have Buffs, reduce Buffs!
Please remember that the Value should be higher when the description of the item that you generated indicates it is high quality, magnificent, or any other term broadly correlated with value or high craftmanship.Do not refer to any words in this prompt in the description. Do not make a description that refers to “medieval fantasy” or “textRPG” or “rpg”
In the following examples the values you should pull from the context and then generated are in double square brackets like this [[value]]. Interpret js methods as if you are a js interpreter. 
BEGIN EXAMPLE INPUT:
Please generate a JSON array of RPG objects:
The rpg items are:shoes
Color=[[]]
Type=[[]]
startnumber=[[]]
Category=[[]]
Totalamount =[[]]  
END EXAMPLE INPUT

BEGIN EXAMPLE OUTPUT:
{
	“Name”: "[[Color]] [[item]]",
	“Color”: "[[Color.capitalize()]]",
	“Value”: [[number between 20-800]],
	“Buff”: {
    	“buffType”:[[pick random bufftype from Global Buff Rule]]",
    	“amount”: [[number between 5-50]]
	},
	“Description”: [[description]],
	“Filename”: "[[startnumber]]_[[Category]]_[[Type]]_[[color.toLowerCase()]].png",    
“Type”: [[Type]],
“Weight: [[number that makes sense given what item is, for example, clothing is between 10 - 100]]
}
END EXAMPLE OUTPUT

Remember, only 10% of the items you generate should have buffs. If you find at the end that more than 10% have Buffs, reduce Buffs!
If there is no Buff, omit the Buff entirely, do not put a null value. If there is no Buff, do not say that the item gives you any ability.  Only items with Buff can give user abilities. Only use the keys that are listed in the example, do not add additional keys. Do not omit any object using //… Return every object in order. The number of objects you return = totalamount.
`


async function chatWithAi(args, message, user) {
    const initiliazing = "Initializing..."
    const username = message.author.username;
    const userId = message.author.id;
    const guildId = message.guild.id;


    try {

        const prompt = args.join(' ')

        user.memories.push(prompt)

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",

            temperature: 0.5,
            messages: [
                { role: "system", content: `${ systemContent }` },
                { role: "assistant", content: user.memories.join(" ") },
                { role: "user", content: prompt }
            ],
        });
        const chatResponse = completion.data.choices[0].message.content

        //++++++++++++++++images++++++++++++++++++++++++
        // const completion = await openai.createImage({
        //     prompt: prompt,
        //     n: 1,
        //     size: "256x256",
        // });


        // const chatResponse = completion.data.data[0].url
        //++++++++++++++++images++++++++++++++++++++++++


        if (user.memories.length > 3) {

            let tooManyMemories = user.memories.slice(-2);

            user.memories = tooManyMemories;
            await user.save()

            return chatResponse
        }

        await user.save()

        return chatResponse

    } catch (e) {
        console.log(`api error ${ e }`)
    }

}

module.exports = { chatWithAi }