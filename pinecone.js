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
            apiKey: process.env.TESTPINECONE_API_KEY,
            environment: process.env.TESTPINECONE_SERVER,
        });
        const index = client.Index(indexName)


        // const ids = ["db8f9356-3643-4765-9172-301f616c0bbb",
        //     "37ebaf93-3eb1-4189-a2b3-5a6e855a7c99",
        //     "6a79594c-6ccb-42bd-aad1-e5dd7dbed235",
        //     "e3ed47f6-ae95-44d4-b4f5-06588e8b5cdf",
        //     "b1603c94-e8a8-40dc-a35c-2367a25bcfe4",
        //     "72a710a3-cfbc-48af-9d97-ede73392a643",
        //     "a930b0f0-c382-4776-a72d-eef508ff8c09",
        //  ,]

        // await index.delete1({
        //     ids: ids,
        //     namespace: 'TESTINDEX'
        // })
    } catch (e) {
        console.log(e)
    }

}

main()