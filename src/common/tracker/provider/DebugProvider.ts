import { logger } from "../../logger";
import type { TrackEvent } from "../type";
import type { TrackArgs } from "./TrackerProvider";
import { TrackerProvider } from "./TrackerProvider";

/**
 * Enable a Debug tracker which will "dry run" log every track requests made.
 */
export class DebugProvider extends TrackerProvider {
    static trackerName = "debug" as const;

    public inited = true;

    public async init(): pvoid {
        return Promise.resolve();
    }

    public track<TEvent extends TrackEvent>(...args: TrackArgs<TEvent>): void {
        const [event, props] = args;
        logger.info("[DebugTracker] Track", { event, props });
    }

    public enable(): void {
        return;
    }

    public disable(): void {
        return;
    }
}
