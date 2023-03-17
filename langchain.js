require('dotenv').config();
const fs = require('fs')
const review = `Midnight Labyrinth was a gothic rock band that formed in London, England in 1995. The band consisted of lead singer and guitarist Raven Blackwood, bassist and backing vocalist Eve Silver, drummer and percussionist Jack Nightshade, and keyboardist and backing vocalist Morgan LeFay.

The band's sound was heavily influenced by gothic literature, horror films, and dark imagery. Their lyrics often dealt with themes of death, despair, and the supernatural. Their live shows were known for their elaborate costumes, eerie stage setups, and haunting visual effects.

Midnight Labyrinth gained a cult following in the UK underground music scene, and their debut album "Shadows of the Night" was released in 1997 to critical acclaim. The album featured the hit single "Darkness Falls", which reached number 5 on the UK charts.

However, the band's success was short-lived, as tensions between members led to their eventual breakup in 1999. Raven Blackwood went on to pursue a solo career, while Eve Silver and Jack Nightshade formed a new band called The Black Roses. Despite their brief career, Midnight Labyrinth remains a beloved and influential band in the gothic rock genre.`

async function main() {
    try {
        const { OpenAI } = await import("langchain/llms")
        const { ChatOpenAI } = await import("langchain/chat_models");
        const { HumanChatMessage } = await import('langchain/schema');
        const { OpenAIEmbeddings } = await import("langchain/embeddings");
        const { PineconeStore } = await import("langchain/vectorstores");
        const { PineconeClient } = await import("@pinecone-database/pinecone");
        const { Document } = await import("langchain/document");
        const { ChatVectorDBQAChain } = await import("langchain/chains")
        const { RecursiveCharacterTextSplitter } = await import("langchain/text_splitter")

        const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 100, chunkOverlap: 1 });
        const docs = await textSplitter.createDocuments([review]);


        // const doc = new Document({ pageContent: "Hello, my name is Charles.  I am a human boy who lives in New Orleans. I like fish!" })

        const chat = new ChatOpenAI({ temperature: 0.9, openAIApiKey: process.env.OPENAI_API_KEY })
        // const embeddings = new OpenAIEmbeddings();
        // const res = await embeddings.embedQuery(text);

        // const response = await chat.call([
        //     new HumanChatMessage(
        //         "Translate this sentence from English to French. I love programming."
        //     ),
        // ]);
        const pinecone = new PineconeClient();
        await pinecone.init({
            environment: process.env.PINECONE_SERVER,
            apiKey: process.env.PINECONE_API_KEY,
        });
        const index = pinecone.Index("testindex");

        // this adds doc to the index
        // const vectorStore = await PineconeStore.fromDocuments(index, docs, new OpenAIEmbeddings(), "text");

        const vectorStore = await PineconeStore.fromExistingIndex(
            index,
            new OpenAIEmbeddings()
        );

        const question = "Who was Tyler Rivers?"
        const model = new OpenAI();
        const chain = await ChatVectorDBQAChain.fromLLM(model, vectorStore, {
            returnSourceDocuments: false,
            k: 150
        });
        const response = await chain.call({
            question: question,
            chat_history: []
        });

        console.log(question, response);
        const chatHistory = question + response["text"];

        const followUpQuestion = "Who was Jack Nightshade?"
        const followUpRes = await chain.call({
            question: followUpQuestion,
            chat_history: chatHistory,
        });

        console.log(followUpQuestion, followUpRes);

    } catch (e) {
        console.log(e)
    }

}

main()