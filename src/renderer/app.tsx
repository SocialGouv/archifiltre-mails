import "normalize.css/normalize.css";
import "./styles/global.scss";

import React from "react";

import { Menu } from "./components/menu/Menu";
import { PathContextProvider } from "./context/PathContext";
import { RouteContextProvider } from "./context/RouterContext";
import { Views } from "./views";

export const App: React.FC = () => (
    <main>
        <PathContextProvider>
            <RouteContextProvider>
                <Menu />
                <Views />
            </RouteContextProvider>
        </PathContextProvider>
    </main>
);
