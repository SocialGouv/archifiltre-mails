import * as SentryBrowser from "@sentry/browser";
import * as Sentry from "@sentry/electron";
import * as SentryNode from "@sentry/node";

import { IS_MAIN, IS_PACKAGED } from "../config";
import { containerModule } from "../modules/ContainerModule";
import { name, version } from "../utils/package";
import type { VoidFunction } from "../utils/type";

/**
 * Setup sentry in main or renderer and return a "post setup"
 * callback to be used after {@link containerModule} loading.
 *
 * The first setup should be set at the top most of the process.
 *
 * @returns "Post setup" tracker integration callback
 */
export const setupSentry = (): VoidFunction => {
    if (!IS_PACKAGED()) return () => void 0;
    const commonOptions: Partial<Sentry.ElectronOptions> = {
        dsn: process.env.SENTRY_DSN,
        getSessions: () => [], // because we do a manual preload
        release: `${name}@${version}`,
    };
    Sentry.init(commonOptions);

    return () => {
        const Client = IS_MAIN
            ? SentryNode.NodeClient
            : SentryBrowser.BrowserClient;
        const trackerIntegrations = containerModule
            .get("trackerService")
            .getProvider()
            .getSentryIntegations();
        Sentry.getCurrentHub().bindClient(
            new Client({
                ...commonOptions,
                initialScope: (scope) => {
                    scope.setUser({
                        id: containerModule
                            .get("userConfigService")
                            .get("appId"),
                    });
                    return scope;
                },
                integrations: (integrations) => [
                    ...integrations,
                    ...trackerIntegrations,
                ],
            })
        );
    };
};
