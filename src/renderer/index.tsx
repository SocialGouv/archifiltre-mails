import "@common/utils/overload";

import { getIsomorphicModules } from "@common/lib/core/isomorphic";
import { loadModules, unloadModules } from "@common/lib/ModuleManager";
import type { Module } from "@common/modules/Module";
import { setupSentry } from "@common/monitoring/sentry";
import React from "react";
import { render } from "react-dom";

import { App } from "./app";
import { ConsoleFromMainModule } from "./modules/ConsoleFromMainModule";
import { pstExporterService } from "./services/PstExporterService";
import { pstExtractorService } from "./services/PstExtractorService";

module.hot?.accept();
// get integrations setup callback
const setupSentryIntegrations = setupSentry();

void (async () => {
    const isomorphicModules = getIsomorphicModules(
        ["pstExtractorService", pstExtractorService],
        ["pstExporterService", pstExporterService]
    );
    const modules: Module[] = [
        ...isomorphicModules,
        new ConsoleFromMainModule(),
    ];
    window.addEventListener("beforeunload", async () =>
        unloadModules(...modules)
    );
    await loadModules(...modules);
    setupSentryIntegrations();

    render(<App />, document.querySelector("#app"));
})();
