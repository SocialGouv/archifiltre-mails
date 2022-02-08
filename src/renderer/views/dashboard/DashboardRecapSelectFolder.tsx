import type { FC } from "react";
import React from "react";
import { useTranslation } from "react-i18next";

import { usePstFolderList } from "../../hooks/usePSTFolderList";
import style from "./Dashboard.module.scss";
import { DashboardRecapSelectFolderItem } from "./DashboardRecapSelectFolderItem";

export interface DashboardRecapSelectFolderProps {
    switchView: () => void;
}

export const DashboardRecapSelectFolder: FC<
    DashboardRecapSelectFolderProps
> = ({ switchView }) => {
    const { t } = useTranslation();
    const { folderList } = usePstFolderList();

    return (
        <div className={style.dashboard__select}>
            <p className={style.dashboard__select__info}>
                {t("dashboard.recap.selectFolder.selector")}
            </p>
            <DashboardRecapSelectFolderItem
                type="deleted"
                pstFolderList={folderList}
            />
            <button onClick={switchView}>
                {t("dashboard.recap.selectFolder.validate")}
            </button>
        </div>
    );
};
