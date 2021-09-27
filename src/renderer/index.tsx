import { ipcRenderer } from "electron";
import React from "react";
import { render } from "react-dom";

import { App } from "./app";

ipcRenderer.on("log", (event, log) => {
    console.log(log);
});

ipcRenderer.on("log-e2e", (event, log) => {
    console.warn(log);
});

if (module.hot) {
    module.hot.accept();
}

render(<App />, document.querySelector("#app"));
