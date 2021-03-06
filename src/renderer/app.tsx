import "normalize.css/normalize.css";
import "./styles/global.scss";

import React from "react";

import { RouteContextProvider } from "./context/RouterContext";
import { Views } from "./views";

export const App: React.FC = () => (
    <main>
        <RouteContextProvider>
            <Views />
        </RouteContextProvider>
    </main>
);
