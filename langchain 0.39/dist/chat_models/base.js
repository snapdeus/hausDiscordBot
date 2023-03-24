import GPT3Tokenizer from "gpt3-tokenizer";
import { AIChatMessage, } from "../schema/index.js";
import { BaseLanguageModel, } from "../base_language/index.js";
import { getBufferString } from "../memory/base.js";
export class BaseChatModel extends BaseLanguageModel {
    constructor({ ...rest }) {
        super(rest);
        Object.defineProperty(this, "_tokenizer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    async generate(messages, stop) {
        const generations = [];
        const llmOutputs = [];
        const messageStrings = messages.map((messageList) => getBufferString(messageList));
        await this.callbackManager.handleLLMStart({ name: this._llmType() }, messageStrings, this.verbose);
        try {
            for (const message of messages) {
                const result = await this._generate(message, stop);
                if (result.llmOutput) {
                    llmOutputs.push(result.llmOutput);
                }
                generations.push(result.generations);
            }
        }
        catch (err) {
            await this.callbackManager.handleLLMError(err, this.verbose);
            throw err;
        }
        const output = {
            generations,
            llmOutput: llmOutputs.length
                ? this._combineLLMOutput?.(...llmOutputs)
                : undefined,
        };
        await this.callbackManager.handleLLMEnd(output, this.verbose);
        return output;
    }
    _modelType() {
        return "base_chat_model";
    }
    getNumTokens(text) {
        // TODOs copied from py implementation
        // TODO: this method may not be exact.
        // TODO: this method may differ based on model (eg codex, gpt-3.5).
        if (this._tokenizer === undefined) {
            const Constructor = GPT3Tokenizer.default;
            this._tokenizer = new Constructor({ type: "gpt3" });
        }
        return this._tokenizer.encode(text).bpe.length;
    }
    async generatePrompt(promptValues, stop) {
        const promptMessages = promptValues.map((promptValue) => promptValue.toChatMessages());
        return this.generate(promptMessages, stop);
    }
    async call(messages, stop) {
        const result = await this.generate([messages], stop);
        const generations = result.generations;
        return generations[0][0].message;
    }
    async callPrompt(promptValue, stop) {
        const promptMessages = promptValue.toChatMessages();
        return this.call(promptMessages, stop);
    }
}
export class SimpleChatModel extends BaseChatModel {
    async _generate(messages, stop) {
        const text = await this._call(messages, stop);
        const message = new AIChatMessage(text);
        return {
            generations: [
                {
                    text: message.text,
                    message,
                },
            ],
        };
    }
}
//# sourceMappingURL=base.js.map