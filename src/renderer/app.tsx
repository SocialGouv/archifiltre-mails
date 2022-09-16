import "normalize.css/normalize.css";
import "./styles/global.scss";

import React from "react";

import { AutoUpdateProvider } from "./context/AutoUpdateContext";
import { RouteContextProvider } from "./context/RouterContext";
import { Views } from "./views";

export const App: React.FC = () => (
    <main>
        <AutoUpdateProvider>
            <RouteContextProvider>
                <Views />
            </RouteContextProvider>
        </AutoUpdateProvider>
    </main>
);
