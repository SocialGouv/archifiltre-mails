import { loadIsomorphicModules } from "@common/core/isomorphic";
import { loadModules } from "@common/lib/ModuleManager";
import React from "react";
import { render } from "react-dom";

import { App } from "./app";
import { ConsoleFromMainModule } from "./modules/ConsoleFromMainModule";
import { pstExtractorService } from "./services/PstExtractorService";

if (module.hot) {
    module.hot.accept();
}

void (async () => {
    await loadIsomorphicModules(["pstExtractorService", pstExtractorService]);
    await loadModules(new ConsoleFromMainModule());
    render(<App />, document.querySelector("#app"));
})();
