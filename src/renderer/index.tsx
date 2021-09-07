import React from "react";
import { render } from "react-dom";

import { App } from "./app";

console.log("echo from renderer");
if (module.hot) {
    console.log("hot reload RENDERER");
    module.hot.accept();
}

render(<App />, document.querySelector("#app"));

console.log("hello again");
