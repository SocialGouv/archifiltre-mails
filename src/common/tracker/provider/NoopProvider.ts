import type {
    TrackAppEventProps,
    TrackCoreEventProps,
    TrackEventProps,
} from "../type";
import { TrackerProvider } from "./TrackerProvider";

export class NoopProvider extends TrackerProvider {
    static trackerName = "noop" as const;

    private flagConsole = false;

    public async init(): Promise<void> {
        return Promise.resolve();
    }

    public track<
        TEvent extends keyof TrackAppEventProps | keyof TrackCoreEventProps
    >(_event: TEvent, _props: TrackEventProps[TEvent]): void {
        this.warn();
    }

    public enable(): void {
        return;
    }

    public disable(): void {
        return;
    }

    private warn() {
        if (!this.flagConsole) {
            // eslint-disable-next-line no-console
            console.warn(
                `[Tracker] No tracker set or found (${process.env.TRACKER_PROVIDER})`
            );
            this.flagConsole = true;
        }
    }
}
