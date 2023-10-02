declare module "*.module.css" {
    const classes: Readonly<Record<string, string>>;
    export default classes;
}

declare module "*.module.sass" {
    const classes: Readonly<Record<string, string>>;
    export default classes;
}

declare module "*.module.scss" {
    const classes: Readonly<Record<string, string>>;
    export default classes;
}

declare module "*.png" {
    const content: string;
    export default content;
}

declare module "source-map-support";
// eslint-disable-next-line @typescript-eslint/naming-convention
declare const __static: string;

declare namespace NodeJS {
    interface ProcessEnv {
        CACHE_PROVIDER: string;
        SENTRY_DSN: string;
        SENTRY_ORG: string;
        SENTRY_URL: string;
        TRACKER_FAKE_HREF?: string;
        TRACKER_MATOMO_ID_SITE: string;
        TRACKER_MATOMO_URL: string;
        TRACKER_POSTHOG_API_KEY: string;
        TRACKER_POSTHOG_URL: string;
        TRACKER_PROVIDER: string;
    }
}

declare module "react-d3-tree/lib/esm/index.js";
