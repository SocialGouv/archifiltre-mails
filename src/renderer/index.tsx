import { ipcRenderer } from "electron";
import React from "react";
import { render } from "react-dom";

import { App } from "./app";

ipcRenderer.on("log", (event, log) => {
    console.log(log);
});

console.log("echo from renderer");
if (module.hot) {
    console.log("hot reload RENDERER");
    module.hot.accept();
}

render(<App />, document.querySelector("#app"));

console.log("hello again");
