import { IS_DIST_MODE, IS_E2E, IS_PACKAGED } from "@common/config";
import path from "path";
import type { WorkerOptions } from "worker_threads";
import { Worker as BaseWorker } from "worker_threads";

const WORKER_BRIDGE_PATH = path.resolve(__dirname, "_worker.js");

/**
 * Worker thread wrapper for typescript workers.
 */
export class TSWorker<TMessageValue = unknown> extends BaseWorker {
    constructor(
        mainRelativeWorkerPath: string,
        options?: Omit<WorkerOptions, "eval">
    ) {
        const _workerPath = getWorkerPath(mainRelativeWorkerPath);
        console.log({ _workerPath });
        super(_workerPath.endsWith(".js") ? _workerPath : WORKER_BRIDGE_PATH, {
            ...options,
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
    postMessage(value: TMessageValue): void {
        super.postMessage(value);
    }
}

const getWorkerPath = (mainRelativeWorkerPath: string) => {
    const absolutePath = path.resolve(__dirname, mainRelativeWorkerPath);
    if (!IS_PACKAGED() && !IS_DIST_MODE && !IS_E2E) {
        return absolutePath;
    }

    return absolutePath.replace(/\.ts$/gi, ".js");
};
