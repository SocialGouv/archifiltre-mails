import "@common/utils/overload";
import "@common/logger";

import { IS_DEV, PRODUCT_CHANNEL } from "@common/config";
import { getIsomorphicModules } from "@common/lib/core/isomorphic";
import { ipcRenderer } from "@common/lib/ipc";
import { loadModules, unloadModules } from "@common/lib/ModuleManager";
import { setupSentry } from "@common/monitoring/sentry";
import { version } from "@common/utils/package";
import React from "react";
import { render } from "react-dom";

import { App } from "./app";
import { pstExporterService } from "./services/PstExporterService";
import { pstExtractorService } from "./services/PstExtractorService";

module.hot?.accept();
// get integrations setup callback
const setupSentryIntegrations = setupSentry();

document.title = `Mails v${version} (${PRODUCT_CHANNEL})`;

void (async () => {
    const isomorphicModules = getIsomorphicModules(
        ["pstExtractorService", pstExtractorService],
        ["pstExporterService", pstExporterService]
    );
    window.addEventListener("beforeunload", async () =>
        unloadModules(...isomorphicModules)
    );
    await loadModules(...isomorphicModules);
    setupSentryIntegrations();

    render(<App />, document.querySelector("#app"));

    if (IS_DEV) {
        window["_archifiltre-debug"] = {
            ipcRenderer,
            modules: isomorphicModules,
        };
    }
})();

declare global {
    export interface Window {
        ["_archifiltre-debug"]: Any;
    }
}
