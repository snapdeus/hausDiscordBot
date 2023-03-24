import { Tool } from "./base.js";
/**
 * Wrapper around SerpAPI.
 *
 * To use, you should have the `serpapi` package installed and the SERPAPI_API_KEY environment variable set.
 */
export class SerpAPI extends Tool {
    constructor(apiKey = process.env.SERPAPI_API_KEY, params = {}) {
        super();
        Object.defineProperty(this, "key", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "params", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "search"
        });
        Object.defineProperty(this, "description", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "a search engine. useful for when you need to answer questions about current events. input should be a search query."
        });
        if (!apiKey) {
            throw new Error("SerpAPI API key not set. You can set it as SERPAPI_API_KEY in your .env file, or pass it to SerpAPI.");
        }
        this.key = apiKey;
        this.params = params;
    }
    /**
     * Run query through SerpAPI and parse result
     */
    async _call(input) {
        const { getJson } = await SerpAPI.imports();
        const res = await getJson("google", {
            ...this.params,
            api_key: this.key,
            q: input,
        });
        if (res.error) {
            throw new Error(`Got error from serpAPI: ${res.error}`);
        }
        if (res.answer_box?.answer) {
            return res.answer_box.answer;
        }
        if (res.answer_box?.snippet) {
            return res.answer_box.snippet;
        }
        if (res.answer_box?.snippet_highlighted_words) {
            return res.answer_box.snippet_highlighted_words[0];
        }
        if (res.sports_results?.game_spotlight) {
            return res.sports_results.game_spotlight;
        }
        if (res.knowledge_graph?.description) {
            return res.knowledge_graph.description;
        }
        if (res.organic_results?.[0]?.snippet) {
            return res.organic_results[0].snippet;
        }
        return "No good search result found";
    }
    static async imports() {
        try {
            const { getJson } = await import("serpapi");
            return { getJson };
        }
        catch (e) {
            throw new Error("Please install serpapi as a dependency with, e.g. `yarn add serpapi`");
        }
    }
}
//# sourceMappingURL=serpapi.js.map