import React from "react";

import { Layout } from "../../components/common/layout/Layout";
import style from "./Dashboard.module.scss";
import type { DashboardAnalyticsInfosProps } from "./DashboardAnalyticsInfos";
import { DashboardAnalyticsInfos } from "./DashboardAnalyticsInfos";
import { DashboardGlobalInfos } from "./DashboardGlobalInfos";

// TODO: Fake data - to replace by PST extracted infos
const PSTAnalyticsDatas: DashboardAnalyticsInfosProps[] = [
    {
        datas: [
            {
                numbers: [30, 50, 40],
                title: "Messages Reçus",
            },
            {
                numbers: [30, 50, 40],
                title: "Messages Envoyés",
            },
            {
                numbers: [30, 50, 40],
                title: "Messages Supprimés",
            },
        ],
        labels: ["Catégorie", "Pourcentage", "Mails", "Pièces Jointes"],
        title: "Mails",
    },
    {
        datas: [
            {
                numbers: [30, 50],
                title: "Contact",
            },
        ],
        labels: ["Catégorie", "Nombre de contacts", "Listes"],
        title: "Contact",
    },
    {
        datas: [
            {
                numbers: [30, 50, 70],
                title: "Agenda",
            },
        ],
        labels: ["Catégorie", "Pourcentage", "Mail", "Pièces Jointes"],
        title: "Agenda",
    },
];

export const Dashboard: React.FC = () => {
    return (
        <Layout className={style.dashboard!} title="Dashboard">
            <h2>Global</h2>
            <DashboardGlobalInfos />

            <h2>Informations</h2>
            <DashboardAnalyticsInfos {...PSTAnalyticsDatas[0]!} />
            <DashboardAnalyticsInfos {...PSTAnalyticsDatas[1]!} />
            <DashboardAnalyticsInfos {...PSTAnalyticsDatas[2]!} />
        </Layout>
    );
};
