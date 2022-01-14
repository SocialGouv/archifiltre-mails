import React from "react";

import { Card } from "../../components/common/card/Card";
import style from "./Dashboard.module.scss";
import { DashboardViewerBreadcrumb } from "./DashboardViewerBreadcrumb";
import { DashboardViewerCircle } from "./DashboardViewerCircle";

export const DashboardViewer: React.FC = () => (
    <div className={style.dashboard__viewer}>
        <Card title="Visualisation" color="grey">
            <DashboardViewerBreadcrumb />
            <DashboardViewerCircle />
        </Card>
    </div>
);
