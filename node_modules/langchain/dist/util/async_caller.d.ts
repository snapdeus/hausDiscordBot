import PQueue from "p-queue";
export interface AsyncCallerParams {
    maxConcurrency?: number;
    maxRetries?: number;
}
/**
 * A class that can be used to make async calls with concurrency and retry logic.
 *
 * This is useful for making calls to any kind of "expensive" external resource,
 * be it because it's rate-limited, subject to network issues, etc.
 *
 * Concurrent calls are limited by the `maxConcurrency` parameter, which defaults
 * to `Infinity`. This means that by default, all calls will be made in parallel.
 *
 * Retries are limited by the `maxRetries` parameter, which defaults to 6. This
 * means that by default, each call will be retried up to 6 times, with an
 * exponential backoff between each attempt.
 */
export declare class AsyncCaller {
    protected maxConcurrency: AsyncCallerParams["maxConcurrency"];
    protected maxRetries: AsyncCallerParams["maxRetries"];
    protected queue: PQueue;
    constructor(params: AsyncCallerParams);
    call<A extends any[], T extends (...args: A) => Promise<any>>(callable: T, ...args: Parameters<T>): Promise<ReturnType<T>>;
}
