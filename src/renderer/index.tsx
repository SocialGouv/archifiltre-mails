import React from "react";
import { render } from "react-dom";

import { userConfig } from "../common/core/config";
import { App } from "./app";

if (module.hot) {
    module.hot.accept();
}

void (async () => {
    await userConfig.init();
    render(<App />, document.querySelector("#app"));
})();
