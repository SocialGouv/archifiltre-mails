import type { FC } from "react";
import React from "react";

import { HomePicto } from "../../../renderer/components/common/pictos/picto";
import style from "./Dashboard.module.scss";

export interface DashboardRecapItemProps {
    picto?: React.ReactElement;
    title: string;
    mails?: number | undefined;
    attachements?: number;
    percentage?: string;
    contact?: number;
}

export const DashboardRecapItem: FC<DashboardRecapItemProps> = ({
    title,
    mails,
    attachements,
    percentage,
    contact,
}) => {
    return (
        <div className={style.dashboard__recap__item}>
            <div className={style.dashboard__recap__picto}>
                <HomePicto />
            </div>
            {contact ? (
                <div className={style.dashboard__recap__informations}>
                    <span
                        className={style.dashboard__recap__informations__item}
                    >
                        {title}
                    </span>
                    <span
                        className={style.dashboard__recap__informations__item}
                    >
                        {contact} contacts
                    </span>
                </div>
            ) : (
                <div className={style.dashboard__recap__informations}>
                    <span
                        className={style.dashboard__recap__informations__item}
                    >
                        {title}
                    </span>
                    <span
                        className={style.dashboard__recap__informations__item}
                    >
                        {percentage} %
                    </span>
                    <span
                        className={style.dashboard__recap__informations__item}
                    >
                        {mails ?? 0} mails
                    </span>
                    <span
                        className={style.dashboard__recap__informations__item}
                    >
                        {attachements} pj
                    </span>
                </div>
            )}
        </div>
    );
};
