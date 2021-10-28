import React from "react";

import { GENERAL, VIZUALISATION } from "../../utils/constants";
import { DashboardGeneral } from "./DashboardGeneral";
import { DashboardVizualisation } from "./DashboardVizualisation";

interface DashboardSwitcherProps {
    tab: string;
}

export const DashboardSwitcher: React.FC<DashboardSwitcherProps> = ({
    tab,
}) => {
    switch (tab) {
        case GENERAL:
            return <DashboardGeneral />;
        case VIZUALISATION:
            return <DashboardVizualisation />;

        default:
            return <DashboardGeneral />;
    }
};
