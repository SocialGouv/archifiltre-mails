import type { FC } from "react";
import React from "react";

import { Card } from "../../../renderer/components/common/card/Card";
import { HomePicto } from "../../../renderer/components/common/pictos/picto";
import { usePSTData } from "../../../renderer/hooks/usePSTData";
import style from "./Dashboard.module.scss";

const DashboardUserSelectFolder: FC = () => {
    const { pstData } = usePSTData();
    console.log(pstData);

    return (
        <div className={style.dashboard__select}>
            <div>
                <label htmlFor="sent-item-select">Messages envoyés</label>
                <select name="sent" id="sent-item-select">
                    <option value="">--Please choose an option--</option>
                    <option value="element">element</option>
                    <option value="item">item</option>
                </select>
            </div>
            <div>
                <label htmlFor="sent-item-select">Messages reçus</label>
                <select name="sent" id="sent-item-select">
                    <option value="">--Please choose an option--</option>
                    <option value="element">element</option>
                    <option value="item">item</option>
                </select>
            </div>
        </div>
    );
};

export const DashboardRecapItem: FC<DashboardRecapItemProps> = ({
    title,
    percentage,
    mails,
    attachments,
}) => (
    <div className={style.dashboard__recap__item}>
        <div className={style.dashboard__recap__picto}>
            <HomePicto />
        </div>
        <div className={style.dashboard__recap__informations}>
            <span className={style.dashboard__recap__informations__item}>
                {title}
            </span>
            <span className={style.dashboard__recap__informations__item}>
                {percentage}%
            </span>
            <span className={style.dashboard__recap__informations__item}>
                {mails} mails
            </span>
            <span className={style.dashboard__recap__informations__item}>
                {attachments} pj
            </span>
        </div>
    </div>
);

interface DashboardRecapItemProps {
    picto: React.ReactElement;
    title: string;
    percentage: number | string;
    mails: number | string;
    attachments: number | string;
}

const dashboardRecapData: DashboardRecapItemProps[] = [
    {
        attachments: "90",
        mails: "1200",
        percentage: "20",
        picto: <HomePicto />,
        title: "Messages reçus",
    },
    {
        attachments: "90",
        mails: "1200",
        percentage: "20",
        picto: <HomePicto />,
        title: "Messages envoyés",
    },
    {
        attachments: "90",
        mails: "1200",
        percentage: "20",
        picto: <HomePicto />,
        title: "Messages supprimés",
    },
    {
        attachments: "90",
        mails: "1200",
        percentage: "20",
        picto: <HomePicto />,
        title: "Dossiers",
    },
    {
        attachments: "90",
        mails: "1200",
        percentage: "20",
        picto: <HomePicto />,
        title: "Conctacts",
    },
];

export const DashboardRecap: FC = () => {
    return (
        <Card title="Synthèse" color="blue">
            <div className={style.dashboard__recap}>
                {dashboardRecapData.map((recap, index) => (
                    <DashboardRecapItem key={index} {...recap} />
                ))}
            </div>
        </Card>
    );
};
