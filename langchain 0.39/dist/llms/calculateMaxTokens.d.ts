import type { TiktokenModel } from "@dqbd/tiktoken";
export declare const getModelContextSize: (modelName: TiktokenModel) => number;
type CalculateMaxTokenProps = {
    prompt: string;
    modelName: TiktokenModel;
};
export declare const calculateMaxTokens: ({ prompt, modelName, }: CalculateMaxTokenProps) => Promise<number>;
export {};
