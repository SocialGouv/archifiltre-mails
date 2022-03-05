import type {
    TrackAppEventProps,
    TrackCoreEventProps,
    TrackEventProps,
} from "../type";
import { TrackerProvider } from "./TrackerProvider";

export class DebugProvider extends TrackerProvider {
    static trackerName = "debug" as const;

    public async init(): Promise<void> {
        return Promise.resolve();
    }

    public track<
        TEvent extends keyof TrackAppEventProps | keyof TrackCoreEventProps
    >(event: TEvent, props: TrackEventProps[TEvent]): void {
        console.info("[DebugTracker] Track", { event, props });
    }

    public enable(): void {
        return;
    }

    public disable(): void {
        return;
    }
}
