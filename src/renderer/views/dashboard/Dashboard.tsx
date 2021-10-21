import React, { useCallback, useState } from "react";

import { GENERAL } from "../../../common/constants";
import { Layout } from "../../components/common/layout/Layout";
import style from "./Dashboard.module.scss";
import { DashboardSwitcher } from "./DashboardSwitcher";
import { DashboardTabsNavigation } from "./DashboardTabsNavigation";

export const Dashboard: React.FC = () => {
    const [tab, setTab] = useState(GENERAL);

    const changeTab = useCallback((nextTab: string) => {
        setTab(nextTab);
    }, []);

    return (
        <Layout classname={style.dashboard}>
            <DashboardTabsNavigation changeTab={changeTab} />
            <DashboardSwitcher tab={tab} />
        </Layout>
    );
};
