require('dotenv').config();


async function main() {
    try {
        const { PineconeClient } = await import("@pinecone-database/pinecone")
        const client = new PineconeClient();
        const indexName = 'testindex'

        await client.init({
            apiKey: process.env.PINECONE_API_KEY,
            environment: process.env.PINECONE_SERVER,
        });
        const index = client.Index(indexName)
        console.log(fetchResponse)
    } catch (e) {
        console.log(e)
    }

}

main()