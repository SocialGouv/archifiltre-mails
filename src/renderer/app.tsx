import "normalize.css/normalize.css";
import "./styles/global.scss";

import React from "react";

import { Menu } from "./components/menu/Menu";
import { RouteContextProvider } from "./context/RouterContext";
import { WorkspaceRouteContextProvider } from "./context/WorkspaceRouter";
import { Views } from "./views";
import { Workspace } from "./views/workspace/Workspace";

export const App: React.FC = () => {
    return (
        <main>
            <RouteContextProvider>
                <WorkspaceRouteContextProvider>
                    <Menu />
                    <Views />
                    <Workspace />
                </WorkspaceRouteContextProvider>
            </RouteContextProvider>
        </main>
    );
};
