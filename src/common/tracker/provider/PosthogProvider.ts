import { default as FrontPostHog } from "posthog-js";
import { default as NodeJsPostHog } from "posthog-node";

import { IS_MAIN } from "../../config";
import type {
    TrackAppEventProps,
    TrackCoreEventProps,
    TrackEventProps,
} from "../type";
import { TrackerProvider } from "./TrackerProvider";

export class PosthogProvider extends TrackerProvider {
    static trackerName = "posthog" as const;

    private tracker?: NodeJsPostHog | typeof FrontPostHog;

    private neverIdentified = true;

    public async init(): Promise<void> {
        if (IS_MAIN) {
            this.tracker = new NodeJsPostHog(
                process.env.TRACKER_POSTHOG_API_KEY,
                {
                    enable: !this.disabled,
                    host: process.env.TRACKER_POSTHOG_URL,
                }
            );
        } else {
            return new Promise<void>((resolve) => {
                FrontPostHog.init(process.env.TRACKER_POSTHOG_API_KEY, {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    api_host: process.env.TRACKER_POSTHOG_URL,
                    loaded: (posthog) => {
                        this.tracker = posthog;
                        resolve();
                    },
                });
            });
        }
    }

    public track<
        TEvent extends keyof TrackAppEventProps | keyof TrackCoreEventProps
    >(event: TEvent, props: TrackEventProps[TEvent]): void {
        if (!this.tracker || this.disabled) return;
        const { appId: distinctId, ...$set } = props;
        if (this.isMain(this.tracker)) {
            if (this.neverIdentified) {
                this.tracker.identify({ distinctId });
                this.neverIdentified = false;
            }
            this.tracker.capture({
                distinctId,
                event,
                properties: {
                    $set,
                },
            });
        } else {
            if (this.neverIdentified) {
                this.tracker.identify(distinctId);
                this.neverIdentified = false;
            }
            this.tracker.capture(event, { $set });
        }
    }

    public enable(): void {
        if (!this.tracker) return;
        if (!this.isMain(this.tracker)) {
            this.tracker.opt_in_capturing();
        }
        return;
    }

    public disable(): void {
        if (!this.tracker) return;
        if (!this.isMain(this.tracker)) {
            this.tracker.opt_out_capturing();
        } else {
            this.tracker.shutdown();
        }
        return;
    }

    private isMain(_: typeof this.tracker): _ is NodeJsPostHog {
        return IS_MAIN;
    }
}
