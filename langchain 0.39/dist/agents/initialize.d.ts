import { Tool } from "./tools/index.js";
import { AgentExecutor } from "./executor.js";
import { BaseLanguageModel } from "../base_language/index.js";
import { CallbackManager } from "../callbacks/index.js";
export declare const initializeAgentExecutor: (tools: Tool[], llm: BaseLanguageModel, agentType?: string, verbose?: boolean, callbackManager?: CallbackManager) => Promise<AgentExecutor>;
