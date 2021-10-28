import "normalize.css/normalize.css";
import "./styles/global.scss";

import React from "react";

import { Menu } from "./components/menu/Menu";
import { RouteContextProvider } from "./context/RouterContext";
import { Views } from "./views";

export const App: React.FC = () => {
    return (
        <main>
            <RouteContextProvider>
                <Menu />
                <Views />
            </RouteContextProvider>
        </main>
    );
};
