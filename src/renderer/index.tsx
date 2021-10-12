import React from "react";
import { render } from "react-dom";

import { IsomorphicModuleFactory } from "../common/core/modules/Module";
import { UserConfigModule } from "../common/core/modules/UserConfigModule";
import { App } from "./app";

if (module.hot) {
    module.hot.accept();
}

void (async () => {
    await IsomorphicModuleFactory.getInstance(UserConfigModule).init();
    render(<App />, document.querySelector("#app"));
})();
