import path from "path";
import type { URL } from "url";
import type { WorkerOptions } from "worker_threads";
import { Worker as BaseWorker } from "worker_threads";

const WORKER_BRIDGE_PATH = path.resolve(__dirname, "_worker.js");

/**
 * Worker thread wrapper for typescript workers.
 */
export class TSWorker<TMessageValue = unknown> extends BaseWorker {
    constructor(
        absoluteWorkerPath: URL | string,
        options?: Omit<WorkerOptions, "eval">
    ) {
        super(WORKER_BRIDGE_PATH, {
            ...options,
            eval: false,
            workerData: {
                ...options?.workerData,
                _workerPath: absoluteWorkerPath,
            },
        });
    }

    /**
     * @override
     */
    postMessage(value: TMessageValue): void {
        super.postMessage(value);
    }
}
