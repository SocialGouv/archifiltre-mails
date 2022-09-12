import type MatomoTracker from "@datapunt/matomo-tracker-js";

import { IS_MAIN } from "../../config";
import { MatomoClient } from "../matomo/MatomoClient";
import type { TrackEvent } from "../type";
import { eventCategoryMap } from "../type";
import type { TrackArgs } from "./TrackerProvider";
import { TrackerProvider } from "./TrackerProvider";

/**
 * Enable a tracking provider associated to Matomo.
 *
 * @deprecated
 */
export class MatomoProvider extends TrackerProvider<
    MatomoTracker,
    MatomoClient
> {
    static trackerName = "matomo" as const;

    public inited = false;

    async init(): pvoid {
        if (this.inited) {
            console.warn("[MatomoProvider] Already inited.");
        }
        if (IS_MAIN) {
            this.tracker = new MatomoClient(
                process.env.TRACKER_MATOMO_ID_SITE,
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
                _id: this.appId,
                e_a: event,
                e_c: category,
                e_n: payload,
                e_v: 1,
                uid: this.appId,
                url: process.env.TRACKER_MATOMO_FAKE_HREF,
            });
            /* eslint-enable @typescript-eslint/naming-convention */
        } else {
            this.tracker.trackEvent({
                action: event,
                category,
                href: process.env.TRACKER_MATOMO_FAKE_HREF,
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

    private isMain(_: typeof this.tracker): _ is MatomoClient {
        return IS_MAIN;
    }
}
