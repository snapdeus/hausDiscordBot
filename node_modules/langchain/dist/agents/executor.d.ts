import { BaseChain } from "../chains/index.js";
import { Agent } from "./agent.js";
import { Tool } from "./tools/base.js";
import { StoppingMethod } from "./types.js";
import { SerializedLLMChain } from "../chains/serde.js";
import { ChainValues } from "../schema/index.js";
import { CallbackManager } from "../callbacks/index.js";
type AgentExecutorInput = {
    agent: Agent;
    tools: Tool[];
    returnIntermediateSteps?: boolean;
    maxIterations?: number;
    earlyStoppingMethod?: StoppingMethod;
    verbose?: boolean;
    callbackManager?: CallbackManager;
};
/**
 * A chain managing an agent using tools.
 * @augments BaseChain
 */
export declare class AgentExecutor extends BaseChain {
    agent: Agent;
    tools: Tool[];
    returnIntermediateSteps: boolean;
    maxIterations?: number;
    earlyStoppingMethod: StoppingMethod;
    get inputKeys(): string[];
    constructor(input: AgentExecutorInput);
    /** Create from agent and a list of tools. */
    static fromAgentAndTools(fields: {
        agent: Agent;
        tools: Tool[];
    } & Record<string, any>): AgentExecutor;
    private shouldContinue;
    _call(inputs: ChainValues): Promise<ChainValues>;
    _chainType(): "agent_executor";
    serialize(): SerializedLLMChain;
}
export {};
