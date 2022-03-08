import { getIsomorphicModules } from "@common/lib/core/isomorphic";
import { loadModules, unloadModules } from "@common/lib/ModuleManager";
import type { Module } from "@common/modules/Module";
import React from "react";
import { render } from "react-dom";

import { App } from "./app";
import { ConsoleFromMainModule } from "./modules/ConsoleFromMainModule";
import { pstExtractorService } from "./services/PstExtractorService";

module.hot?.accept();

void (async () => {
    const isomorphicModules = getIsomorphicModules([
        "pstExtractorService",
        pstExtractorService,
    ]);
    const modules: Module[] = [
        ...isomorphicModules,
        new ConsoleFromMainModule(),
    ];
    window.addEventListener("beforeunload", async () =>
        unloadModules(...modules)
    );
    await loadModules(...modules);
    // setupSentry();

    render(<App />, document.querySelector("#app"));
})();
