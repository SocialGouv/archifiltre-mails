import React from "react";

import { Layout } from "../../components/common/layout/Layout";
import style from "./Dashboard.module.scss";
import { DashboardVizualisation } from "./DashboardVizualisation";

export const Dashboard: React.FC = () => {
    return (
        <Layout className={style.dashboard}>
            <DashboardVizualisation />
        </Layout>
    );
};
