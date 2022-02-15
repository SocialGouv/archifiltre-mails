import React from "react";
import { useTranslation } from "react-i18next";

import { Card } from "../../components/common/card/Card";
import { DashboardViewerBreadcrumb } from "./DashboardViewerBreadcrumb";
import { DashboardViewerCircle } from "./DashboardViewerCircle";

export const DashboardViewer: React.FC = () => {
    const { t } = useTranslation();
    // TODO: "grey" => const
    return (
        <Card title={t("dashboard.viewer.cardTitle")} color="grey">
            <DashboardViewerBreadcrumb />
            <DashboardViewerCircle />
        </Card>
    );
};
