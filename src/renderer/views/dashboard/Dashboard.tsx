import React from "react";

import { Card } from "../../components/common/card/Card";
import { usePstStore } from "../../store/PSTStore";
import style from "./Dashboard.module.scss";
import { DashboardActions } from "./DashboardActions";
import { DashboardInformations } from "./DashboardInformations";
import { DashboardRecap } from "./DashboardRecap";
import { DashboardViewer } from "./DashboardViewer";

export interface DashboardComponentProps {
    className?: string;
}

export const DashboardMailBody: React.FC<DashboardComponentProps> = ({
    className,
}) => {
    const { mainInfos } = usePstStore();

    return (
        <Card title="Mail" color="grey" className={className}>
            <div className="dashboard__mail">
                {mainInfos && mainInfos.email ? (
                    <div
                        dangerouslySetInnerHTML={{
                            __html: mainInfos.email.contentText,
                        }}
                    />
                ) : (
                    <div>Empty</div>
                )}
            </div>
        </Card>
    );
};

export const Dashboard: React.FC = () => {
    return (
        <div className={style.dashboard}>
            <DashboardActions />
            <div className={style.dashboard__cards}>
                <DashboardViewer />
                <DashboardRecap />
                <div className={style.dashboard__infos}>
                    <DashboardInformations />
                    <DashboardMailBody />
                </div>
                {/* <DashboardImpact /> */}
            </div>
        </div>
    );
};
// export const Dashboard: React.FC = () => {
//     return (
//         <div className={style.dashboard}>
//             <DashboardActions />
//             <div className={style.dashboard__cards}>
//                 <DashboardViewer />

//                 <div className={style.dashboard__infos}>
//                     <DashboardRecap />
//                     <DashboardInformations />
//                     {/* <DashboardImpact /> */}
//                     <DashboardMailBody />
//                 </div>
//             </div>
//         </div>
//     );
// };
