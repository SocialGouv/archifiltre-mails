import type { TrackAppId, TrackEvent, TrackEventProps } from "../type";

export abstract class TrackerProvider {
    static trackerName: string;

    constructor(protected uid: TrackAppId, protected disabled = true) {}

    public abstract init(): Promise<void>;

    public abstract track<TEvent extends TrackEvent>(
        event: TEvent,
        props: Omit<TrackEventProps[TEvent], "appId">
    ): void;

    public abstract enable(): void;
    public abstract disable(): void;
}
