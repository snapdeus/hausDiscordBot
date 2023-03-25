/* eslint-disable no-else-return */
import { z } from "zod";
import { BaseOutputParser, OutputParserException } from "../schema/index.js";
function printSchema(schema, depth = 0) {
    if (schema instanceof z.ZodString) {
        return "string";
    }
    else if (schema instanceof z.ZodArray) {
        return `${printSchema(schema._def.type, depth)}[]`;
    }
    else if (schema instanceof z.ZodObject) {
        const indent = "\t".repeat(depth);
        const indentIn = "\t".repeat(depth + 1);
        return `{
${Object.entries(schema.shape)
            .map(([key, value]) => 
        // eslint-disable-next-line prefer-template
        `${indentIn}"${key}": ${printSchema(value, depth + 1)}` +
            (value._def.description
                ? ` // ${value._def.description}`
                : ""))
            .join("\n")}
${indent}}`;
    }
    else {
        throw new Error(`Unsupported type: ${schema}`);
    }
}
export class StructuredOutputParser extends BaseOutputParser {
    constructor(schema) {
        super();
        Object.defineProperty(this, "schema", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: schema
        });
    }
    static fromZodSchema(schema) {
        return new this(schema);
    }
    static fromNamesAndDescriptions(schemas) {
        const zodSchema = z.object(Object.fromEntries(Object.entries(schemas).map(([name, description]) => [name, z.string().describe(description)])));
        return new this(zodSchema);
    }
    getFormatInstructions() {
        return `The output should be a markdown code snippet formatted in the following schema:

\`\`\`json
${printSchema(this.schema)}
\`\`\` 
`;
    }
    async parse(text) {
        try {
            const json = text.trim().split("```json")[1].split("```")[0].trim();
            return this.schema.parse(JSON.parse(json));
        }
        catch (e) {
            throw new OutputParserException(`Failed to parse. Text: ${text}. Error: ${e}`);
        }
    }
}
//# sourceMappingURL=structured.js.map