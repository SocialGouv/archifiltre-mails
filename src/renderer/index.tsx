import { loadIsomorphicModules } from "@common/core/isomorphic";
import React from "react";
import { render } from "react-dom";

import { App } from "./app";
import { pstExtractorService } from "./services/PstExtractorService";

if (module.hot) {
    module.hot.accept();
}

void (async () => {
    await loadIsomorphicModules(["pstExtractorService", pstExtractorService]);
    render(<App />, document.querySelector("#app"));
})();
