import type { Integration } from "@sentry/types";

import type { ExtendedClass, Nothing } from "../../utils/type";
import type { TrackAppId, TrackEvent, TrackEventProps } from "../type";

export type ExtendedTrackerProvider = ExtendedClass<typeof TrackerProvider>;
export type TrackArgs<TEvent extends TrackEvent> =
    TrackEventProps[TEvent] extends Nothing
        ? [event: TEvent]
        : [event: TEvent, props: TrackEventProps[TEvent]];
export abstract class TrackerProvider {
    static trackerName: string;

    public abstract inited: boolean;

    constructor(protected appId: TrackAppId, protected disabled: boolean) {}

    public getSentryIntegations(): Integration[] {
        return [];
    }

    public abstract init(): Promise<void>;

    public abstract track<TEvent extends TrackEvent>(
        ...args: TrackArgs<TEvent>
    ): void;

    public abstract enable(): void;
    public abstract disable(): void;
}
