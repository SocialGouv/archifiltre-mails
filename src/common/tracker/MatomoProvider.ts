/* eslint-disable @typescript-eslint/naming-convention */
import FrontMatomoTracker from "@datapunt/matomo-tracker-js";
import { MatomoTracker as NodeJsMatomoTracker } from "matomo-tracker";

import { IS_MAIN } from "../config";
import type { TrackEvent, TrackEventProps } from "./type";
import { eventCategoryMap } from "./type";

export class MatomoProvider {
    private tracker!: FrontMatomoTracker | NodeJsMatomoTracker;

    public async init(): Promise<void> {
        if (IS_MAIN) {
            this.tracker = new NodeJsMatomoTracker(
                +process.env.MATOMO_ID_SITE,
                `${process.env.MATOMO_URL}/piwik.php`
            );
        } else {
            this.tracker = new FrontMatomoTracker({
                linkTracking: true,
                siteId: +process.env.MATOMO_ID_SITE,
                srcUrl: `${process.env.MATOMO_URL}/piwik.js`,
                trackerUrl: `${process.env.MATOMO_URL}/piwik.php`,
                urlBase: process.env.MATOMO_URL,
            });
        }

        return Promise.resolve();
    }

    public track<TEvent extends TrackEvent>(
        event: TEvent,
        props: TrackEventProps[TEvent]
    ): void {
        const category = eventCategoryMap[event];
        if (this.isMain(this.tracker)) {
            // this.tracker.trackEvent();
        } else {
            this.tracker.trackEvent({
                action: event,
                category,
                value,
            });
        }
    }

    private isMain(
        tracker: typeof this.tracker
    ): tracker is NodeJsMatomoTracker {
        return IS_MAIN;
    }
}
