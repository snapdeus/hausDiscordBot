require('dotenv').config();
const { PineconeClient } = require('@pinecone-database/pinecone')
//FIX FOR BUG ONNX RUNTIME WEB 
/* https://github.com/xenova/transformers.js/issues/4 */
global.self = global;
const { pipeline, env } = require("@xenova/transformers")
env.onnx.wasm.numThreads = 1


// async function main() {
//     try {
// /
// let sentences = ["There is a dog on my lawn", "I've got to go back to work.", "There is a dog on my lawn"]
// let embedder = await pipeline('embeddings', 'sentence-transformers/all-MiniLM-L6-v2')
// let output = await embedder(sentences)
// console.log(output)
//   Compute pairwise cosine similarity
// for (let i = 0; i < sentences.length; ++i) {
//     for (let j = i + 1; j < sentences.length; ++j) {
//         console.log(`(${ i },${ j }):`, embedder.cos_sim(output[i], output[j]))
//     }
// }

// let pairwiseScores = [[output[0], output[1]], [output[0], output[2]], [output[1], output[2]]].map(x => embedder.cos_sim(...x))

// await embedder.dispose()

// console.log(pairwiseScores)
//     } catch (e) {
//         console.log(e)
//     }
// }

// main()



async function main() {
    try {
        const client = new PineconeClient();
        const indexName = 'testindex'

        await client.init({
            apiKey: process.env.PINECONE_API_KEY,
            environment: process.env.PINECONE_SERVER,
        });
        const index = client.Index(indexName)
        console.log(index)
    } catch (e) {
        console.log(e)
    }

}

main()