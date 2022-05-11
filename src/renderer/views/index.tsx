import React from "react";

import { useRouteContext } from "../context/RouterContext";
import { Dashboard } from "./dashboard/Dashboard";
import { StartScreen } from "./start-screen/StartScreen";
import { UserConfigPanel } from "./user-config-panel";

export const ROUTES = {
    DASHBOARD: <Dashboard />,
    START_SCREEN: <StartScreen />,
};

export type RouteName = keyof typeof ROUTES;

export const Views: React.FC = () => {
    const { route } = useRouteContext();
    return (
        <>
            {ROUTES[route]}
            <UserConfigPanel />
        </>
    );
};
