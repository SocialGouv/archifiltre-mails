import type { FC } from "react";
import React from "react";
import { useTranslation } from "react-i18next";

import { usePstStore } from "../../store/PSTStore";
import style from "./Dashboard.module.scss";

export interface DashboardRecapSelectFolderItemProps {
    pstFolderList: string[];
    type: "deleted" | "sent";
}

export const DashboardRecapSelectFolderItem: FC<
    DashboardRecapSelectFolderItemProps
> = ({ pstFolderList, type }) => {
    const { t } = useTranslation();
    const { setDeletedFolder, setSentFolder } = usePstStore();

    const handleChange = (folderName: string) => {
        if (type === "sent") {
            setSentFolder(folderName);
        } else setDeletedFolder(folderName);
    };

    return (
        <div className={style.dashboard__select__item}>
            <select
                onChange={(event) => {
                    handleChange(event.target.value);
                }}
                name="sent"
                id="sent-item-select"
            >
                <option value="">
                    -- {t("dashboard.recap.selectFolder.choosePlaceholder")} --
                </option>
                {pstFolderList.map((folder) => (
                    <option value={folder} key={folder}>
                        {folder}
                    </option>
                ))}
            </select>
        </div>
    );
};
