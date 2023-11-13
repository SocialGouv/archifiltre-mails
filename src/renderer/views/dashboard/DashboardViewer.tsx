import React, { useReducer } from "react";
import { useTranslation } from "react-i18next";

import { Card } from "../../components/common/card/Card";
import { CirclePacking } from "../../components/viewer/CirclePacking";
import { HierarchyContainer } from "../../components/viewer/Hierarchy";
import { TreeContainer } from "../../components/viewer/Tree";
import { DashboardViewerSelector } from "./DashboardViewerSelector";

const activeView = (active: number) =>
    active === 0
        ? "circle"
        : active === 1
        ? "hierarchy"
        : active === 2
        ? "tree"
        : "";

export const DashboardViewer: React.FC = () => {
    const { t } = useTranslation();
    const [active, updateActive] = useReducer(
        (_: number, next: number) => next,
        0
    );

    const dataView = activeView(active);

    return (
        <Card
            title={t("dashboard.viewer.cardTitle")}
            color="grey"
            dataView={dataView}
        >
            <DashboardViewerSelector
                active={active}
                updateActive={updateActive}
            />
            {active === 0 && <CirclePacking />}
            {active === 1 && <HierarchyContainer />}
            {active === 2 && <TreeContainer />}
        </Card>
    );
};
