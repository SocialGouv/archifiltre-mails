import React from "react";

import { EarthPicto } from "../../../renderer/components/common/pictos/picto";
import style from "./Dashboard.module.scss";

interface DashboardGlobalInfosCardProps {
    label: string;
    value: number;
}
// TODO: Fake data - to replace by PST extracted infos
const PSTGlobalInfosDatas: DashboardGlobalInfosCardProps[] = [
    {
        label: "Éléments",
        value: 13500,
    },
    {
        label: "Pièces jointes",
        value: 13500,
    },
    {
        label: "Emails",
        value: 13500,
    },
    {
        label: "Contacts",
        value: 13500,
    },
    {
        label: "Dossiers",
        value: 13500,
    },
];

const DashboardGlobalInfosCard: React.FC<DashboardGlobalInfosCardProps> = ({
    label,
    value,
}) => (
    <div className={style.dashboard__global__card}>
        <EarthPicto />
        <span>{label}</span>
        <span>{value}</span>
    </div>
);

export const DashboardGlobalInfos: React.FC = () => (
    <div className={style.dashboard__global}>
        {PSTGlobalInfosDatas.map((keyInfo, index) => (
            <DashboardGlobalInfosCard {...keyInfo} key={index} />
        ))}
    </div>
);
