import axios from "axios";

/**
 * @see https://developer.matomo.org/api-reference/tracking-api
 */
export interface RecommmendedTrackOptions {
    /**
     * The unique visitor ID, must be a 16 characters hexadecimal string.
     * Every unique visitor must be assigned a different ID and this ID must not change after it is assigned.
     * If this value is not set Matomo (formerly Piwik) will still track visits, but the unique visitors metric might be less accurate.
     */
    _id: string;
    /**
     * The title of the action being tracked.
     * It is possible to [use slashes / to set one or several categories for this action](https://matomo.org/faq/how-to/#faq_62).
     * For example, **Help / Feedback** will create the Action **Feedback** in the category **Help**.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    action_name: string;
    apiv: number;
    rand: string;
    url: string;
}

/**
 * We recommend that these parameters be used if the information is available and relevant to your use case.
 */
export interface OptionalUserInfoTrackOptions {
    /**
     * This is a JSON encoded string of the custom variable array
     * @see https://matomo.org/docs/custom-variables/
     */
    _cvar?: string;
    /**
     * The UNIX timestamp of this visitor's first visit. This could be set to the date where the user first started using your software/app, or when he/she created an account.
     * This parameter is used to populate the *Goals > Days to Conversion* report.
     */
    _idts?: number;
    /**
         * The UNIX timestamp of this visitor's previous visit. This parameter is used to populate the report *Visitors > Engagement > Visits by days since last visit*.

         */
    _viewts?: number;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    e_a?: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    e_c?: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    e_n?: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    e_v?: number;
    /**
     * The current hour (local time).
     */
    h?: number;
    /**
     * The current minute (local time).
     */
    m?: number;
    /**
     * If set to 1, will force a new visit to be created for this action.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    new_visit?: 1;
    /**
     * The current second (local time).
     */
    s?: number;
    /**
     * Defines the [User ID](https://matomo.org/docs/user-id/) for this request. User ID is any non-empty unique string identifying the user (such as an email address or an username).
     * To access this value, users must be logged-in in your system so you can fetch this user ID from your system, and pass it to Matomo.
     *
     * The User ID appears in the visits log, the Visitor profile, and you can Segment reports for one or several User ID (userId segment).
     *
     * When specified, the User ID will be "enforced". This means that if there is no recent visit with this User ID, a new one will be created.
     * If a visit is found in the last 30 minutes with your specified User ID, then the new action will be recorded to this existing visit.
     */
    uid?: string;
}

/**
 * Basic {@link axios} client for Matomo tracking system.
 *
 * @deprecated
 */
export class MatomoClient {
    constructor(
        private readonly matomoIdSite = process.env.TRACKER_MATOMO_ID_SITE,
        private readonly matomoUrl = process.env.TRACKER_MATOMO_URL
    ) {}

    /**
     * Executes the call to the Matomo tracking API
     *
     * For a list of tracking option parameters see
     * https://developer.matomo.org/api-reference/tracking-api
     *
     * @param options URL to track or options (must contain URL as well)
     */
    track(
        options: OptionalUserInfoTrackOptions &
            Partial<RecommmendedTrackOptions>
    ): void {
        void axios
            .get(this.matomoUrl, {
                params: {
                    ...options,
                    idsite: this.matomoIdSite,
                    rec: 1,
                },
            })
            .then((res) => {
                console.log(
                    "MATOMO RESPONSE",
                    res.status,
                    res.statusText,
                    res.data,
                    res.headers
                );
            });
    }
}
