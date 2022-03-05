import FrontMatomoTracker from "@datapunt/matomo-tracker-js";
import { MatomoTracker as NodeJsMatomoTracker } from "matomo-tracker";

import { IS_MAIN } from "../../config";
import type { TrackEvent, TrackEventProps } from "../type";
import { eventCategoryMap } from "../type";
import { TrackerProvider } from "./TrackerProvider";

export class MatomoProvider extends TrackerProvider {
    static trackerName = "matomo" as const;

    private tracker?: FrontMatomoTracker | NodeJsMatomoTracker;

    async init(): Promise<void> {
        if (IS_MAIN) {
            this.tracker = new NodeJsMatomoTracker(
                +process.env.TRACKER_MATOMO_ID_SITE,
                `${process.env.TRACKER_MATOMO_URL}/piwik.php`
            );
        } else {
            this.tracker = new FrontMatomoTracker({
                linkTracking: true,
                siteId: +process.env.TRACKER_MATOMO_ID_SITE,
                srcUrl: `${process.env.TRACKER_MATOMO_URL}/piwik.js`,
                trackerUrl: `${process.env.TRACKER_MATOMO_URL}/piwik.php`,
                urlBase: process.env.TRACKER_MATOMO_URL,
            });
        }

        return Promise.resolve();
    }

    public track<TEvent extends TrackEvent>(
        event: TEvent,
        props: TrackEventProps[TEvent]
    ): void {
        if (this.disabled || !this.tracker) {
            return;
        }
        const category = eventCategoryMap[event];
        const { appId, ...rest } = props;
        const payload = JSON.stringify(rest);
        if (this.isMain(this.tracker)) {
            /* eslint-disable @typescript-eslint/naming-convention */
            this.tracker.track({
                e_a: event,
                e_c: category,
                e_n: JSON.stringify(rest),
                e_v: 1,
                uid: appId,
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
