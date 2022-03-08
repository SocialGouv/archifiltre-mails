import * as Sentry from "@sentry/electron";

import { IS_MAIN, IS_PACKAGED } from "../config";
import { containerModule } from "../modules/ContainerModule";
import { name, version } from "../utils/package";

export const setupSentry = (): void => {
    if (IS_PACKAGED()) {
        if (IS_MAIN) {
            Sentry.init({
                dsn: process.env.SENTRY_DSN,
                getSessions: () => [],
                release: `${name}@${version}`,
            });
        } else {
            Sentry.init({
                debug: true,
                integrations: containerModule
                    .get("trackerService")
                    .getProvider()
                    .getSentryIntegations(),
            });
        }
    }
};
