import React from "react";

import { DASHBOARD, ECOLOGY, HISTORY } from "../../common/constants";
import { useRouteContext } from "../context/RouterContext";
import { Dashboard } from "./dashboard/Dashboard";
import { Ecology } from "./ecology/Ecology";
import { History } from "./history/History";

export const Views: React.FC = () => {
    const { route } = useRouteContext();

    switch (route) {
        case DASHBOARD:
            return <Dashboard />;
        case HISTORY:
            return <History />;
        case ECOLOGY:
            return <Ecology />;
        default:
            return <Dashboard />;
    }
};
