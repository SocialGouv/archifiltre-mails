import type { TrackEvent } from "../type";
import type { TrackArgs } from "./TrackerProvider";
import { TrackerProvider } from "./TrackerProvider";

export class DebugProvider extends TrackerProvider {
    static trackerName = "debug" as const;

    public inited = true;

    public async init(): Promise<void> {
        return Promise.resolve();
    }

    public track<TEvent extends TrackEvent>(...args: TrackArgs<TEvent>): void {
        const [event, props] = args;
        console.info("[DebugTracker] Track", { event, props });
    }

    public enable(): void {
        return;
    }

    public disable(): void {
        return;
    }
}
