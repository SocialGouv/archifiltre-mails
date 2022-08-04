import { IS_DIST_MODE, IS_PACKAGED } from "@common/config";
import type { Any } from "@common/utils/type";
import path from "path";
import type { WorkerOptions } from "worker_threads";
import { SHARE_ENV, Worker as BaseWorker } from "worker_threads";

const WORKER_BRIDGE_PATH = path.resolve(__dirname, "_worker.js");
const PACKAGED_WORKERS_FOLDER_RESOURCE_PATH = "workers";

/**
 * Worker thread wrapper for typescript workers.
 */
export class TSWorker<
    TMessageInputValue = unknown,
    TMessageOutputValue = unknown
> extends BaseWorker {
    constructor(
        mainRelativeWorkerPath: string,
        options?: Omit<WorkerOptions, "eval">
    ) {
        const _workerPath = getWorkerPath(mainRelativeWorkerPath);
        super(_workerPath.endsWith(".js") ? _workerPath : WORKER_BRIDGE_PATH, {
            ...options,
            env: SHARE_ENV,
            eval: false,
            workerData: {
                ...options?.workerData,
                _workerPath,
            },
        });
    }

    /**
     * @override
     */
    postMessage(value: TMessageInputValue): void {
        super.postMessage(value);
    }

    /**
     * @override
     */
    addListener(event: "error", listener: (err: Error) => void): this;
    /**
     * @override
     */
    addListener(event: "exit", listener: (exitCode: number) => void): this;
    /**
     * @override
     */
    addListener(
        event: "message",
        listener: (value: TMessageOutputValue) => void
    ): this;
    /**
     * @override
     */
    addListener(event: "messageerror", listener: (error: Error) => void): this;
    /**
     * @override
     */
    addListener(event: "online", listener: () => void): this;
    /**
     * @override
     */
    addListener(
        event: string | symbol,
        listener: (...args: Any[]) => void
    ): this {
        super.addListener(event, listener);
        return this;
    }

    /**
     * @override
     */
    on(event: "error", listener: (err: Error) => void): this;
    /**
     * @override
     */
    on(event: "exit", listener: (exitCode: number) => void): this;
    /**
     * @override
     */
    on(event: "message", listener: (value: TMessageOutputValue) => void): this;
    /**
     * @override
     */
    on(event: "messageerror", listener: (error: Error) => void): this;
    /**
     * @override
     */
    on(event: "online", listener: () => void): this;
    /**
     * @override
     */
    on(event: string | symbol, listener: (...args: Any[]) => void): this {
        super.on(event, listener);
        return this;
    }

    /**
     * @override
     */
    once(event: "error", listener: (err: Error) => void): this;
    /**
     * @override
     */
    once(event: "exit", listener: (exitCode: number) => void): this;
    /**
     * @override
     */
    once(
        event: "message",
        listener: (value: TMessageOutputValue) => void
    ): this;
    /**
     * @override
     */
    once(event: "messageerror", listener: (error: Error) => void): this;
    /**
     * @override
     */
    once(event: "online", listener: () => void): this;
    /**
     * @override
     */
    once(event: string | symbol, listener: (...args: Any[]) => void): this {
        super.once(event, listener);
        return this;
    }
}

const getWorkerPath = (mainRelativeWorkerPath: string) => {
    // TODO: path validator
    if (IS_PACKAGED()) {
        const absoluteProdWorkerPath = path.resolve(
            process.resourcesPath,
            PACKAGED_WORKERS_FOLDER_RESOURCE_PATH,
            mainRelativeWorkerPath.replace(/\.ts$/gi, ".js")
        );

        return absoluteProdWorkerPath;
    }
    const distDevWorkerPath = path.resolve(__dirname, mainRelativeWorkerPath);

    if (IS_DIST_MODE) {
        return distDevWorkerPath.replace(/\.ts$/gi, ".js");
    }
    return distDevWorkerPath;
};
