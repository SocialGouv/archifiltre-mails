import type { FC } from "react";
import React from "react";

import { usePstStore } from "../../store/PSTStore";
import style from "./Dashboard.module.scss";

export interface DashboardRecapSelectFolderItemProps {
    pstFolderList: string[];
    type: "deleted" | "sent";
}

export const DashboardRecapSelectFolderItem: FC<
    DashboardRecapSelectFolderItemProps
> = ({ pstFolderList }) => {
    const { setDeletedFolder } = usePstStore();

    const handleChange = (folderName: string) => {
        setDeletedFolder(folderName);
    };

    return (
        <div className={style.dashboard__select__item}>
            <select
                onChange={(event) => {
                    handleChange(event.target.value);
                }}
                name="delete"
                id="delete-item-select"
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
