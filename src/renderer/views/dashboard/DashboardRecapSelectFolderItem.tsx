import type { FC } from "react";
import React from "react";

import { usePSTStore } from "../../../renderer/store/PSTStore";
import style from "./Dashboard.module.scss";

interface DashboardRecapSelectFolderItemProps {
    pstFolderList: string[];
    type: "deleted" | "sent";
}

export const DashboardRecapSelectFolderItem: FC<
    DashboardRecapSelectFolderItemProps
> = ({ pstFolderList, type }) => {
    const { setDeletedFolder, setSentFolder } = usePSTStore();

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
                    -- Choisissez votre dossier de messages supprimés --
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
