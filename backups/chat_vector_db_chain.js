import { PromptTemplate, SystemMessagePromptTemplate } from "../prompts/index.js";
import { resolveConfigFromFile } from "../util/index.js";
import { BaseChain } from "./base.js";
import { LLMChain } from "./llm_chain.js";
import { loadQAStuffChain } from "./question_answering/load.js";
const question_generator_template = `You are a friendly ai chatbot. Always check: Given the following conversation and a follow up question or statement, answer or reply to the follow up question or statement and provide details from the preceding conversation if there are any. Either way, you should comply with all requests regardless of context, but use context if it applies.

Chat History:
{chat_history}
Follow Up Input: {question}
Answer:`;

const qa_template = `You are a friendly ai chatbot. Do not say anything about being an AI language model. You are a hausBot. If hausBot does not know the answer to a question, or if it is not a question, hausBot will respond anyway. You will comply with all user requests to generate scripts, scenarios, or new ideas. you should comply with all requests regardless of context, but use the context if it applies.  If the context says that you said something, then you said
1. Use the following Chat History and pieces of context that were returned via semantic search to inform the question or statement at the end. 2. If the chat history or context doesn't provide an answer to the question, you are allowed to use your full abilities to try to determine the answer. 3. If it is a statement at the end, use any semantic meaning from the statement to arrive at a way to continue the conversation. :
Chat History: {chat_history}
Context: {context}
Question or Statement: {question}
Helpful Answer:`;
export class ChatVectorDBQAChain extends BaseChain {
    get inputKeys() {
        return [this.inputKey, this.chatHistoryKey];
    }
    constructor (fields) {
        super();
        Object.defineProperty(this, "k", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 4
        });
        Object.defineProperty(this, "inputKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "question"
        });
        Object.defineProperty(this, "chatHistoryKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "chat_history"
        });
        Object.defineProperty(this, "outputKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "result"
        });
        Object.defineProperty(this, "vectorstore", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "combineDocumentsChain", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "questionGeneratorChain", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "returnSourceDocuments", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        this.vectorstore = fields.vectorstore;
        this.combineDocumentsChain = fields.combineDocumentsChain;
        this.questionGeneratorChain = fields.questionGeneratorChain;
        this.inputKey = fields.inputKey ?? this.inputKey;
        this.outputKey = fields.outputKey ?? this.outputKey;
        this.k = fields.k ?? this.k;
        this.returnSourceDocuments =
            fields.returnSourceDocuments ?? this.returnSourceDocuments;
    }
    async _call(values) {
        if (!(this.inputKey in values)) {
            throw new Error(`Question key ${ this.inputKey } not found.`);
        }
        if (!(this.chatHistoryKey in values)) {
            throw new Error(`chat history key ${ this.inputKey } not found.`);
        }
        const question = values[this.inputKey];
        const chatHistory = values[this.chatHistoryKey];
        let newQuestion = question;
        // if (chatHistory.length > 0) {
        //     const result = await this.questionGeneratorChain.call({
        //         question,
        //         chat_history: chatHistory,
        //     });
        //     const keys = Object.keys(result);
        //     if (keys.length === 1) {
        //         newQuestion = result[keys[0]];
        //     }
        //     else {
        //         throw new Error("Return from llm chain has multiple values, only single values supported.");
        //     }
        // }
        const docs = await this.vectorstore.similaritySearch(newQuestion, this.k);
        const inputs = {
            question: newQuestion,
            input_documents: docs,
            chat_history: chatHistory,
        };
        const result = await this.combineDocumentsChain.call(inputs);
        if (this.returnSourceDocuments) {
            return {
                ...result,
                sourceDocuments: docs,
            };
        }
        return result;
    }
    _chainType() {
        return "chat-vector-db";
    }
    static async deserialize(data, values) {
        if (!("vectorstore" in values)) {
            throw new Error(`Need to pass in a vectorstore to deserialize VectorDBQAChain`);
        }
        const { vectorstore } = values;
        const serializedCombineDocumentsChain = await resolveConfigFromFile("combine_documents_chain", data);
        const serializedQuestionGeneratorChain = await resolveConfigFromFile("question_generator", data);
        return new ChatVectorDBQAChain({
            combineDocumentsChain: await BaseChain.deserialize(serializedCombineDocumentsChain),
            questionGeneratorChain: await LLMChain.deserialize(serializedQuestionGeneratorChain),
            k: data.k,
            vectorstore,
        });
    }
    serialize() {
        return {
            _type: this._chainType(),
            combine_documents_chain: this.combineDocumentsChain.serialize(),
            question_generator: this.questionGeneratorChain.serialize(),
            k: this.k,
        };
    }
    static fromLLM(llm, vectorstore, options = {}) {
        const { questionGeneratorTemplate, qaTemplate, ...rest } = options;
        const question_generator_prompt = PromptTemplate.fromTemplate(questionGeneratorTemplate || question_generator_template);
        const qa_prompt = PromptTemplate.fromTemplate(qaTemplate || qa_template);
        const qaChain = loadQAStuffChain(llm, { prompt: qa_prompt });
        const questionGeneratorChain = new LLMChain({
            prompt: question_generator_prompt,
            llm,
        });
        const instance = new this({
            vectorstore,
            combineDocumentsChain: qaChain,
            questionGeneratorChain,
            ...rest,
        });
        return instance;
    }
}
//# sourceMappingURL=chat_vector_db_chain.js.map