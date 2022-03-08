import type FrontMatomoTracker from "@datapunt/matomo-tracker-js";
import type { MatomoTracker as NodeJsMatomoTracker } from "matomo-tracker";

import { IS_MAIN } from "../../config";
import type { TrackEvent } from "../type";
import { eventCategoryMap } from "../type";
import type { TrackArgs } from "./TrackerProvider";
import { TrackerProvider } from "./TrackerProvider";

export class MatomoProvider extends TrackerProvider {
    static trackerName = "matomo" as const;

    public inited = false;

    private tracker?: FrontMatomoTracker | NodeJsMatomoTracker;

    async init(): Promise<void> {
        if (this.inited) {
            console.warn("[MatomoProvider] Already inited.");
        }
        if (IS_MAIN) {
            this.tracker = new (await import("matomo-tracker")).MatomoTracker(
                +process.env.TRACKER_MATOMO_ID_SITE,
                `${process.env.TRACKER_MATOMO_URL}/piwik.php`
            );
            this.inited = true;
        } else {
            this.tracker = new (
                await import("@datapunt/matomo-tracker-js")
            ).default({
                linkTracking: true,
                siteId: +process.env.TRACKER_MATOMO_ID_SITE,
                srcUrl: `${process.env.TRACKER_MATOMO_URL}/piwik.js`,
                trackerUrl: `${process.env.TRACKER_MATOMO_URL}/piwik.php`,
                urlBase: process.env.TRACKER_MATOMO_URL,
                userId: this.appId,
            });
            this.inited = true;
        }

        return Promise.resolve();
    }

    public track<TEvent extends TrackEvent>(...args: TrackArgs<TEvent>): void {
        const [event, props] = args;
        if (this.disabled || !this.tracker) {
            return;
        }
        const category = eventCategoryMap[event];
        const payload = JSON.stringify(props);
        if (this.isMain(this.tracker)) {
            /* eslint-disable @typescript-eslint/naming-convention */
            this.tracker.track({
                e_a: event,
                e_c: category,
                e_n: payload,
                e_v: 1,
                uid: this.appId,
            });
            /* eslint-enable @typescript-eslint/naming-convention */
        } else {
            this.tracker.trackEvent({
                action: event,
                category,
                name: payload,
                value: 1,
            });
        }
    }

    public enable(): void {
        if (!this.isMain(this.tracker)) {
            this.tracker?.enableLinkTracking(true);
            this.tracker?.pushInstruction("forgetUserOptOut");
        }
        this.disabled = false;
    }

    public disable(): void {
        if (!this.isMain(this.tracker)) {
            this.tracker?.enableLinkTracking(false);
            this.tracker?.pushInstruction("optUserOut");
        }
        this.disabled = true;
    }

    private isMain(_: typeof this.tracker): _ is NodeJsMatomoTracker {
        return IS_MAIN;
    }
}
