import React from "react";

import { Card } from "../../components/common/card/Card";
import { isMailMainInfos, usePstStore } from "../../store/PSTStore";
import type { DashboardComponentProps } from "./Dashboard";
import style from "./Dashboard.module.scss";

export const DashboardMailBody: React.FC<DashboardComponentProps> = ({
    className,
}) => {
    const { mainInfos } = usePstStore();

    if (!mainInfos) return null; // TODO: loader

    return (
        <Card title="Mail" color="grey" className={className}>
            <div className={style.dashboardMail}>
                {isMailMainInfos(mainInfos) ? (
                    <div style={{ overflow: "scroll" }}>
                        {mainInfos.data.email.contentText}
                    </div>
                ) : (
                    <div data-i18n="TODO">Empty</div>
                )}
            </div>
        </Card>
    );
};
