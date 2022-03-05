import { useService } from "@common/modules/ContainerModule";
import { bytesToGigabytes } from "@common/utils";
import React, { useEffect } from "react";

import { useAttachmentCountStore } from "../../store/PstAttachmentCountStore";
import { usePstFileSizeStore } from "../../store/PstFileSizeStore";
import { useMailCountStore } from "../../store/PstMailCountStore";
import { usePstStore } from "../../store/PSTStore";
import style from "./Dashboard.module.scss";
import { DashboardActions } from "./DashboardActions";
import { DashboardImpact } from "./DashboardImpact";
import { DashboardInformations } from "./DashboardInformations";
import { DashboardRecap } from "./DashboardRecap";
import { DashboardViewer } from "./DashboardViewer";

export interface DashboardComponentProps {
    className?: string;
}

export const Dashboard: React.FC = () => {
    const { totalFileSize } = usePstFileSizeStore();
    const { attachmentTotal: attachmentCount } = useAttachmentCountStore();
    const { totalMail: mailCount } = useMailCountStore();
    const { pstProgressState } = usePstStore();
    const trackerService = useService("trackerService");

    useEffect(() => {
        if (
            !pstProgressState ||
            pstProgressState.progress ||
            !attachmentCount ||
            !mailCount ||
            !totalFileSize
        ) {
            return;
        }
        trackerService?.getProvider().track("PST Dropped", {
            attachmentCount,
            loadTime: pstProgressState.elapsed,
            mailCount,
            size: bytesToGigabytes(totalFileSize),
        });
    }, [
        trackerService,
        pstProgressState,
        attachmentCount,
        mailCount,
        totalFileSize,
    ]);

    return (
        <div className={style.dashboard}>
            <div className={style.dashboard__header}>
                <DashboardActions />
                <DashboardImpact />
            </div>
            <div className={style.dashboard__cards}>
                <DashboardViewer />
                <div className={style.dashboardInfos}>
                    <DashboardRecap />
                    <DashboardInformations />
                </div>
            </div>
        </div>
    );
};
