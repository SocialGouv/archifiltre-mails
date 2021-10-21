import React from "react";

import {
    AUDIT,
    ENRICHMENT,
    GENERAL,
    REDUNDANCE,
} from "../../../common/constants";
import { DashboardAudit } from "./DashboardAudit";
import { DashboardEnrichment } from "./DashboardEnrichment";
import { DashboardGeneral } from "./DashboardGeneral";
import { DashboardRedundance } from "./DashboardRedundance";

interface DashboardSwitcherProps {
    tab: string;
}

export const DashboardSwitcher: React.FC<DashboardSwitcherProps> = ({
    tab,
}) => {
    switch (tab) {
        case GENERAL:
            return <DashboardGeneral />;
        case ENRICHMENT:
            return <DashboardEnrichment />;
        case AUDIT:
            return <DashboardAudit />;
        case REDUNDANCE:
            return <DashboardRedundance />;
        default:
            return <DashboardGeneral />;
    }
};
