require('dotenv').config()

const { Configuration, OpenAIApi } = require("openai");
const Discord = require('discord.js');
const { v4: uuidv4 } = require('uuid');
let short_term_memory;
let memory_offset;
let config;
let k_value;
let openAIModelName;
if (process.env.NODE_ENV?.trim() === 'development') {
    config = require('../config/config.test.json');
    short_term_memory = 3;
    memory_offset = 2;
    k_value = 1;
    openAIModelName = 'gpt-4'
} else {
    config = require('../config/config.json');
    short_term_memory = 6;
    memory_offset = 3;
    k_value = 3;
    openAIModelName = "gpt-3.5-turbo";
}


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


async function chatWithAi(args, message, memory, chatBot) {
    const initiliazing = "Initializing..."
    const username = message.author.username;
    const userId = message.author.id;
    const guildId = message.guild.id;


    try {
        const { ChatOpenAI } = await import("langchain/chat_models");
        const { OpenAIEmbeddings } = await import("langchain/embeddings");
        const { PineconeStore } = await import("langchain/vectorstores");
        const { PineconeClient } = await import("@pinecone-database/pinecone");
        const { ChatVectorDBQAChain } = await import("langchain/chains");
        const { RecursiveCharacterTextSplitter } = await import("langchain/text_splitter");
        const { CallbackManager } = await import('langchain/callbacks');



        // process.env.LANGCHAIN_HANDLER = "langchain";



        const callbackManager = CallbackManager.fromHandlers({
            handleLLMStart: async (llm, prompts) => {

                console.log("LLM", JSON.stringify(llm, null, 2));
                console.log("PROMPTS", JSON.stringify(prompts, null, 2));
            },
            handleLLMEnd: async (output) => {
                console.log(JSON.stringify(output, null, 2));
            },
            handleLLMError: async (err) => {
                console.error(err);
            },
        });

        const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 1 });
        const PINECONE_NAME_SPACE = "TESTINDEX"
        const model = new ChatOpenAI({

            temperature: 0.8,
            openAIApiKey: process.env.OPENAI_API_KEY,
            modelName: openAIModelName,
            // modelName: 'gpt-4',


            // verbose: true,
            // callbackManager,
        })
        const pinecone = new PineconeClient();
        await pinecone.init({
            environment: config.PINECONE_SERVER,
            apiKey: config.PINECONE_API_KEY,
        });
        const index = pinecone.Index("testindex");
        //OLD WAY OF DOING THE PINECONE DBCONFIG
        // const vectorStore = await PineconeStore.fromExistingIndex(
        //     index,
        //     new OpenAIEmbeddings(),
        //     'text',
        //     PINECONE_NAME_SPACE
        // );

        const vectorStore = await PineconeStore.fromExistingIndex(
            new OpenAIEmbeddings(),
            { pineconeIndex: index, textKey: "text", namespace: PINECONE_NAME_SPACE, },

        );
        const prompt = args.join(' ')

        const oldMemoriesArray = [];
        //construct each conversation memory and push to 
        for (mem of memory.memories) {
            oldMemoriesArray.push(`${ mem.userName } said: ${ mem.userStatement }.  ${ mem.aiName } replied ${ mem.aiStatement }.`)
        }

        const memoryObject = {
            oldMemories: oldMemoriesArray.join(" "),
            loadMemoryVariables: function () {
                return { memoryKey: "chat_history" }
            }
        }


        //AGENT STUFF
        // const executor = await initializeAgentExecutor(
        //     tools,
        //     model,
        //     "chat-conversational-react-description",
        //     true
        // );
        // executor.memory = memoryObject
        // const input0 = `"hi, i am bob"`;
        // const response = await executor.call({ input: input0, chat_history: [memoryObject.chat_history] });



        const chain = await ChatVectorDBQAChain.fromLLM(
            model,
            vectorStore,
            {
                returnSourceDocuments: false,
                k: k_value
            }
        );

        const response = await chain.call({

            question: prompt,
            chat_history: [memoryObject.oldMemories],

        });


        const chatResponse = response['text']

        //BUILD CHAT MEMEORY
        const thisChatMemory = {
            memoryId: uuidv4(),
            userStatement: prompt,
            aiStatement: chatResponse,
            userId: userId,
            userName: username,
            aiName: chatBot,
        }

        memory.memories.push(thisChatMemory)


        //We want short term memory to be an array of 20 memories
        //after we reach 20 memories, we are going to store those 20 memories in the long term memory
        //then short term will be reset
        // console.log(memory.memories.length)
        //TRIM TOTAL MEMORIES TO BE NO MORE THAN 20
        if (memory.memories.length > short_term_memory) {
            const chatHistoryDocs = await textSplitter.createDocuments(oldMemoriesArray);
            await PineconeStore.fromDocuments(
                chatHistoryDocs,
                new OpenAIEmbeddings(),
                {
                    pineconeIndex: index,
                    textKey: "text",
                    namespace: PINECONE_NAME_SPACE,
                },);
            //instead of setting array to max of twenty as below
            // let tooManyMemories = memory.memories.slice(-20);
            // memory.memories = tooManyMemories;
            //we will instead empty the array
            memory.memories = memory.memories.splice(-(short_term_memory - memory_offset));
        }

        await memory.save()
        return chatResponse

    } catch (e) {
        console.log(`api error ${ e }`)
    }

}

module.exports = { chatWithAi }