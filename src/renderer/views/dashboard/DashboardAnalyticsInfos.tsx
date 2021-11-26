import React from "react";

import { HomePicto } from "../../../renderer/components/common/pictos/picto";
import style from "./Dashboard.module.scss";

interface NumbersDataType {
    numbers: number[];
    title: string;
}

export interface DashboardAnalyticsInfosProps {
    datas: NumbersDataType[];
    labels: string[];
    title: string;
}

const DashboardAnalyticsInfosNumbers: React.FC<NumbersDataType> = ({
    title,
    numbers,
}) => (
    <div className={style.dashboard__analytics__item__detail}>
        <div>
            <div>
                <HomePicto />
            </div>
        </div>

        <div>{title}</div>
        {numbers.map((number, index) => (
            <div key={index}>{number}</div>
        ))}
    </div>
);

export const DashboardAnalyticsInfos: React.FC<
    DashboardAnalyticsInfosProps
> = ({ datas, title, labels }) => (
    <div className={style.dashboard__analytics}>
        <h3>{title}</h3>
        <div className={style.dashboard__analytics__label}>
            <div />
            {labels.map((data, index) => (
                <div key={index}>{data}</div>
            ))}
        </div>
        <div className={style.dashboard__analytics__item}>
            {datas.map((data, index) => (
                <DashboardAnalyticsInfosNumbers {...data} key={index} />
            ))}
        </div>
    </div>
);
