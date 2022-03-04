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

declare namespace NodeJS {
    interface ProcessEnv {
        MATOMO_ID_SITE: string;
        MATOMO_URL: string;
    }
}
