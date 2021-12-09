import React from "react";

import { Card } from "../../../renderer/components/common/card/Card";
import style from "./Dashboard.module.scss";
import { DashboardVizualisationBreadcrumb } from "./DashboardVizualisationBreadcrumb";
import { DashboardVizualisationCircle } from "./DashboardVizualisatonCircle";

export const DashboardVizualisation: React.FC = () => (
    <div className={style.dashboard__vizualisation}>
        <Card title="Visualisation" color="grey">
            <DashboardVizualisationBreadcrumb />
            <DashboardVizualisationCircle />
        </Card>
    </div>
);
