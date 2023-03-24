import { v4 as uuidv4 } from "uuid";
import { VectorStore } from "./base.js";
import { Document } from "../document.js";
export class PineconeStore extends VectorStore {
    constructor(embeddings, args) {
        super(embeddings, args);
        Object.defineProperty(this, "textKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "pineconeIndex", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "filter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.embeddings = embeddings;
        this.namespace = args.namespace;
        this.pineconeIndex = args.pineconeIndex;
        this.textKey = args.textKey ?? "text";
        this.filter = args.filter;
    }
    async addDocuments(documents, ids) {
        const texts = documents.map(({ pageContent }) => pageContent);
        return this.addVectors(await this.embeddings.embedDocuments(texts), documents, ids);
    }
    async addVectors(vectors, documents, ids) {
        const documentIds = ids == null ? documents.map(() => uuidv4()) : ids;
        const pineconeVectors = vectors.map((values, idx) => ({
            id: documentIds[idx],
            metadata: {
                ...documents[idx].metadata,
                [this.textKey]: documents[idx].pageContent,
            },
            values,
        }));
        // Pinecone recommends a limit of 100 vectors per upsert request
        const chunkSize = 50;
        for (let i = 0; i < pineconeVectors.length; i += chunkSize) {
            const chunk = pineconeVectors.slice(i, i + chunkSize);
            await this.pineconeIndex.upsert({
                upsertRequest: {
                    vectors: chunk,
                    namespace: this.namespace,
                },
            });
        }
    }
    async similaritySearchVectorWithScore(query, k, filter) {
        if (filter && this.filter) {
            throw new Error("cannot provide both `filter` and `this.filter`");
        }
        const _filter = filter ?? this.filter;
        const results = await this.pineconeIndex.query({
            queryRequest: {
                includeMetadata: true,
                namespace: this.namespace,
                topK: k,
                vector: query,
                filter: _filter,
            },
        });
        const result = [];
        if (results.matches) {
            for (const res of results.matches) {
                const { [this.textKey]: pageContent, ...metadata } = (res.metadata ??
                    {});
                if (res.score) {
                    result.push([new Document({ metadata, pageContent }), res.score]);
                }
            }
        }
        return result;
    }
    static async fromTexts(texts, metadatas, embeddings, dbConfig) {
        const docs = [];
        for (let i = 0; i < texts.length; i += 1) {
            const newDoc = new Document({
                pageContent: texts[i],
                metadata: metadatas[i],
            });
            docs.push(newDoc);
        }
        const args = {
            pineconeIndex: "pineconeIndex" in dbConfig
                ? dbConfig.pineconeIndex
                : dbConfig.pineconeClient,
            textKey: dbConfig.textKey,
            namespace: dbConfig.namespace,
        };
        return PineconeStore.fromDocuments(docs, embeddings, args);
    }
    static async fromDocuments(docs, embeddings, dbConfig) {
        const args = dbConfig;
        args.textKey = dbConfig.textKey ?? "text";
        const instance = new this(embeddings, args);
        await instance.addDocuments(docs);
        return instance;
    }
    static async fromExistingIndex(embeddings, dbConfig) {
        const instance = new this(embeddings, dbConfig);
        return instance;
    }
}
//# sourceMappingURL=pinecone.js.map