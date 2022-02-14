import React from "react";

import { Card } from "../../components/common/card/Card";
import {
    isMailMainInfos,
    usePstFMInfosStore,
} from "../../store/PstFMInfosStore";
import type { DashboardComponentProps } from "./Dashboard";
import style from "./Dashboard.module.scss";

export const DashboardMailBody: React.FC<DashboardComponentProps> = ({
    className,
}) => {
    const { mainInfos } = usePstFMInfosStore();

    if (!mainInfos) return null;

    return (
        <Card title="Mail" color="grey" className={className}>
            <div className={style.dashboardMail}>
                {isMailMainInfos(mainInfos) ? (
                    <div style={{ overflow: "scroll" }}>
                        {mainInfos.data.email.contentText}
                    </div>
                ) : (
                    <div>Empty</div>
                )}
            </div>
        </Card>
    );
};
