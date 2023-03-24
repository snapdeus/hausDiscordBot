import type { getJson as GetJsonT, GoogleParameters } from "serpapi";
import { Tool } from "./base.js";
/**
 * Wrapper around SerpAPI.
 *
 * To use, you should have the `serpapi` package installed and the SERPAPI_API_KEY environment variable set.
 */
export declare class SerpAPI extends Tool {
    protected key: string;
    protected params: Partial<GoogleParameters>;
    constructor(apiKey?: string | undefined, params?: Partial<GoogleParameters>);
    name: string;
    /**
     * Run query through SerpAPI and parse result
     */
    _call(input: string): Promise<any>;
    description: string;
    static imports(): Promise<{
        getJson: typeof GetJsonT;
    }>;
}
