import React from "react";

import { Layout } from "../../components/common/layout/Layout";
import style from "./History.module.scss";

// interface DashboardProps {}

export const History: React.FC = () => (
    <Layout className={style.history!} title="Historique">
        history
    </Layout>
);
