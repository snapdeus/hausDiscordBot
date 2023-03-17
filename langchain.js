require('dotenv').config();
const fs = require('fs')
const review = `Midnight Labyrinth was a gothic rock band that formed in London, England in 1995. The band consisted of lead singer and guitarist Raven Blackwood, bassist and backing vocalist Eve Silver, drummer and percussionist Jack Nightshade, and keyboardist and backing vocalist Morgan LeFay.

The band's sound was heavily influenced by gothic literature, horror films, and dark imagery. Their lyrics often dealt with themes of death, despair, and the supernatural. Their live shows were known for their elaborate costumes, eerie stage setups, and haunting visual effects.

Midnight Labyrinth gained a cult following in the UK underground music scene, and their debut album "Shadows of the Night" was released in 1997 to critical acclaim. The album featured the hit single "Darkness Falls", which reached number 5 on the UK charts.

However, the band's success was short-lived, as tensions between members led to their eventual breakup in 1999. Raven Blackwood went on to pursue a solo career, while Eve Silver and Jack Nightshade formed a new band called The Black Roses. Despite their brief career, Midnight Labyrinth remains a beloved and influential band in the gothic rock genre.
Electric Visions was a psychedelic rock band that emerged from the underground music scene in San Francisco in 1992. The band consisted of four members: lead singer and guitarist Jack "The Visionary" Johnson, bassist and backing vocalist Lily "The Muse" Garcia, keyboardist and synth player Alex "The Wizard" Wong, and drummer and percussionist Max "The Shaman" Lee.

The band's sound was heavily influenced by the psychedelic rock of the 1960s, but they added their own modern twist to the genre. Their music was characterized by swirling guitars, trippy synths, and dreamy vocals that transported listeners to otherworldly realms.

In 1993, Electric Visions released their debut album, "Electric Dreams," to critical acclaim. The album featured hit singles such as "Rainbow Sky" and "Electric Love," which quickly became fan favorites. The band's live performances were also legendary, with elaborate light shows and projections that added to the psychedelic experience.

Over the next few years, Electric Visions continued to tour and release albums, including "Third Eye" in 1995 and "Cosmic Journey" in 1997. However, internal tensions within the band began to rise, and in 1998, they announced their official breakup.

Despite their short-lived career, Electric Visions left a lasting impact on the psychedelic rock scene of the 90s. Their music and live performances continue to inspire new generations of musicians and fans who seek to capture the same otherworldly magic that Electric Visions brought to the stage.
Velvet Eclipse was an alternative rock band that formed in Seattle, Washington in 1993. The band consisted of lead singer and guitarist Ava Blackwood, bassist Max Stone, and drummer Tyler Rivers. They quickly gained a following in the local music scene with their introspective lyrics and dynamic live performances.

In 1994, Velvet Eclipse signed with a major record label and released their debut album, "Midnight Sun," which received critical acclaim and spawned several radio hits. The album showcased the band's ability to blend grunge, alternative rock, and pop sensibilities.

However, despite their success, the band members struggled with internal conflicts and substance abuse issues. In 1996, they announced a hiatus and went their separate ways. Velvet Eclipse's legacy lives on as a beloved band of the 90s alternative rock scene.
Nirvana was a hugely influential American rock band that formed in 1987 in Aberdeen, Washington. The band consisted of Kurt Cobain on vocals and guitar, Krist Novoselic on bass, and Dave Grohl on drums. Nirvana is often credited with popularizing the grunge genre of rock music and leading the way for alternative rock in the 1990s. Their music was characterized by its heavy, distorted guitar sound, combined with Cobain's introspective and often anguished lyrics.

Nirvana's breakthrough came with the release of their second album, "Nevermind," in 1991. The album's lead single, "Smells Like Teen Spirit," became an instant hit and propelled the band to international fame. The album went on to sell over 30 million copies worldwide and has been widely regarded as one of the greatest albums of all time. Nirvana's success was further cemented with their performance on MTV Unplugged in 1993, which showcased the band's acoustic arrangements of their songs and highlighted Cobain's songwriting abilities.

Despite their massive success, Nirvana was plagued by Cobain's personal struggles with addiction and depression. In 1994, Cobain was found dead in his home in Seattle, Washington, from a self-inflicted gunshot wound. His death shocked the music world and led to an outpouring of grief from fans around the world. Nirvana's legacy has continued to endure in the decades since Cobain's death, with their music remaining popular and influential to this day.

In addition to their musical achievements, Nirvana's impact on popular culture has been significant. They were known for their anti-establishment ethos and their rejection of mainstream culture, which resonated with a generation of disillusioned youth in the 1990s. Nirvana's fashion sense, particularly Cobain's trademark thrift store flannel shirts and Converse sneakers, has  also been widely imitated and continues to influence fashion trends today.
`

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
        const { BufferWindowMemory } = await import("langchain/memory")
        const { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate, MessagesPlaceholder, } = await import('langchain/prompts')

        const chatPrompt = ChatPromptTemplate.fromPromptMessages([
            SystemMessagePromptTemplate.fromTemplate(
                "The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know."
            ),
            new MessagesPlaceholder("history"),
            HumanMessagePromptTemplate.fromTemplate("{input}"),
        ]);

        const memory = new BufferWindowMemory({ k: 5 });
        const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 1 });
        const docs = await textSplitter.createDocuments([review]);


        // const doc = new Document({ pageContent: "Hello, my name is Charles.  I am a human boy who lives in New Orleans. I like fish!" })

        const model = new ChatOpenAI({ temperature: 0.9, openAIApiKey: process.env.OPENAI_API_KEY })
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

        const question = "Who was Kurt Cobain"

        const chain = await ChatVectorDBQAChain.fromLLM(
            model,
            vectorStore,
            memory,
            {
                prompt: chatPrompt,
                returnSourceDocuments: false,
                k: 5
            }
        );


        // const response = await chain.call({
        //     question: question,
        //     chat_history: []
        // });

        // console.log(response)
        // let chatHistory = question + response["text"];
        // const chatHistoryDocs = await textSplitter.createDocuments([chatHistory]);


        // const followUpQuestion = "Who was Kris Novoselic"
        // const followUpRes = await chain.call({
        //     question: followUpQuestion,
        //     chat_history: [...chatHistory],
        // });
        // chatHistory = followUpQuestion + followUpRes["text"];
        // console.log(followUpRes)

        // const followUpQuestion2 = "What was the first question I asked you?"
        // const followUpRes2 = await chain.call({
        //     question: followUpQuestion2,
        //     chat_history: [...chatHistory],
        // });

        // console.log(followUpRes2)
        /*uncomment below to test similarity search */
        const query = 'What was the first question I asked you?';
        const results = await vectorStore.similaritySearch(query, 5);

        console.log("results", results);

    } catch (e) {
        console.log(e)
    }

}

main()