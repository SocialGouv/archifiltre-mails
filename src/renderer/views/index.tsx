import React from "react";

import { useRouteContext } from "../context/RouterContext";
import { DASHBOARD, ECOLOGY, HISTORY, START_SCREEN } from "../utils/constants";
import { Dashboard } from "./dashboard/Dashboard";
import { Ecology } from "./ecology/Ecology";
import { History } from "./history/History";
import { StartScreen } from "./start-screen/StartScreen";

export const Views: React.FC = () => {
    const { route } = useRouteContext();

    switch (route) {
        case START_SCREEN:
            return <StartScreen />;

        case DASHBOARD:
            return <Dashboard />;
        case HISTORY:
            return <History />;
        case ECOLOGY:
            return <Ecology />;
        default:
            return <StartScreen />;
    }
};
