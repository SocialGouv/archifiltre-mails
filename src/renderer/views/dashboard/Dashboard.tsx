import React, { useCallback, useState } from "react";

import { Layout } from "../../components/common/layout/Layout";
import { VIZUALISATION } from "../../utils/constants";
import style from "./Dashboard.module.scss";
import { DashboardSwitcher } from "./DashboardSwitcher";
import { DashboardTabsNav } from "./DashboardTabsNav";

export const Dashboard: React.FC = () => {
    const [tab, setTab] = useState(VIZUALISATION);

    const changeTab = useCallback((nextTab: string) => {
        setTab(nextTab);
    }, []);

    return (
        <Layout classname={style.dashboard}>
            <DashboardTabsNav changeTab={changeTab} />
            <DashboardSwitcher tab={tab} />
        </Layout>
    );
};
