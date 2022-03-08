import type { Integration } from "@sentry/types";
import type FrontPostHog from "posthog-js";
import type NodeJsPostHog from "posthog-node";

import { IS_MAIN } from "../../config";
import type { TrackEvent } from "../type";
import type { TrackArgs } from "./TrackerProvider";
import { TrackerProvider } from "./TrackerProvider";

export class PosthogProvider extends TrackerProvider {
    static trackerName = "posthog" as const;

    public inited = false;

    private tracker?: NodeJsPostHog | typeof FrontPostHog;

    public async init(): Promise<void> {
        if (this.inited) {
            console.warn("[PosthogProvider] Already inited.", this.disabled);
        }
        if (IS_MAIN) {
            this.tracker = new (await import("posthog-node")).default(
                process.env.TRACKER_POSTHOG_API_KEY,
                {
                    enable: !this.disabled,
                    host: process.env.TRACKER_POSTHOG_URL,
                }
            );
            this.tracker.identify({ distinctId: this.appId });
            this.inited = true;
        } else {
            return new Promise<void>(
                (resolve) =>
                    void import("posthog-js").then(
                        ({ default: frontPostHog }) =>
                            frontPostHog.init(
                                process.env.TRACKER_POSTHOG_API_KEY,
                                {
                                    // eslint-disable-next-line @typescript-eslint/naming-convention
                                    api_host: process.env.TRACKER_POSTHOG_URL,
                                    // autocapture: false,
                                    // debug: true,
                                    // eslint-disable-next-line @typescript-eslint/naming-convention
                                    // disable_session_recording: true,
                                    loaded: (posthog) => {
                                        this.tracker = posthog;
                                        this.tracker.identify(this.appId);
                                        this.inited = true;
                                        resolve();
                                    },
                                }
                            )
                    )
            );
        }
    }

    public getSentryIntegations(): Integration[] {
        if (this.tracker && !this.isMain(this.tracker)) {
            return [
                new this.tracker.SentryIntegration(
                    this.tracker,
                    process.env.SENTRY_ORG,
                    +process.env.SENTRY_DSN.split("/").reverse()[0]!,
                    // TODO: verify
                    process.env.SENTRY_URL
                ),
            ];
        }
        return [];
    }

    public track<TEvent extends TrackEvent>(...args: TrackArgs<TEvent>): void {
        const [event, props] = args;
        if (!this.tracker || this.disabled) return;
        if (this.isMain(this.tracker)) {
            this.tracker.capture({
                distinctId: this.appId,
                event,
                properties: { ...props },
            });
        } else {
            this.tracker.capture(
                event,
                { ...props },
                {
                    transport: "sendBeacon",
                }
            );
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
