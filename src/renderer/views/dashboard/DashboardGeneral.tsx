import React from "react";

import { TitleH1 } from "../../components/common/title/Title";
import style from "./Dashboard.module.scss";

export const DashboardGeneral: React.FC = () => {
    return (
        <div className={style.general}>
            <TitleH1 title="Général" />
        </div>
    );
};
