const fs = require('fs');
const path = require('path');
const { OpenAI } = require("openai");
require('dotenv').config();


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
});

const speechFile = path.resolve("./speech4.mp3");

async function main() {
    const mp3 = await openai.audio.speech.create({
        model: "tts-1-hd",
        // response_format: "flac",
        voice: "onyx",
        input: `I have spent many pleasant hours in the woods conducting perform-
        ances of my silent piece, transcriptions, that is, for an audience of myself,
        since they were much longer than the popular length which I have had
        published. At one performance, I passed the first movement by attempting
        the identification of a mushroom which remained successfully unidentified.
        The second movement was extremely dramatic, beginning with the sounds
        of a buck and a doe leaping up to within ten feet of my rocky podium. The
        expressivity of this movement was not only dramatic but unusually sad
        from my point of view, for the animals were frightened simply because I
        was a human being. However, they left hesitatingly and fittingly within the
        structure of the work. The third movement was a return to the theme of the
        first, but with all those profound, so-well-known alterations of world feeling
        associated by German tradition with the A-B-A.
        In the space that remains, I would like to emphasize that I am not
        interested in the relationships between sounds and mushrooms any more
        than I am in those between sounds and other sounds. These would involve
        an introduction of logic that is not only out of place in the world, but time-
        consuming. We exist in a situation demanding greater earnestness, as I can
        testify, since recently I was hospitalized after having cooked and eaten
        experimentally some Spathyema foetida, commonly known as skunk cabbage. My blood pressure went down to fifty, stomach was pumped, etc. It
        behooves us therefore to see each thing directly as it is, be it the sound of a
        tin whistle or the elegant Lepiota procera.`,
    });
    console.log(mp3);
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);
}
main();

