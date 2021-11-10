import React from "react";

import { useRouteContext } from "../context/RouterContext";
import { Dashboard } from "./dashboard/Dashboard";
import { Ecology } from "./ecology/Ecology";
import { History } from "./history/History";
import { StartScreen } from "./start-screen/StartScreen";

export const ROUTES = {
    DASHBOARD: <Dashboard />,
    ECOLOGY: <Ecology />,
    HISTORY: <History />,
    START_SCREEN: <StartScreen />,
};

export type RouteName = keyof typeof ROUTES;

export const Views: React.FC = () => {
    const { route } = useRouteContext();
    return ROUTES[route] ?? ROUTES.START_SCREEN;
};
