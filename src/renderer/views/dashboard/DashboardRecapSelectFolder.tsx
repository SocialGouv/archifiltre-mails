import type { FC } from "react";
import React from "react";

import { usePstFolderList } from "../../hooks/usePstFolderList";
import style from "./Dashboard.module.scss";
import { DashboardRecapSelectFolderItem } from "./DashboardRecapSelectFolderItem";

export interface DashboardRecapSelectFolderProps {
    switchView: () => void;
}

export const DashboardRecapSelectFolder: FC<
    DashboardRecapSelectFolderProps
> = ({ switchView }) => {
    const { folderList } = usePstFolderList();

    return (
        <div className={style.dashboard__select}>
            <p className={style.dashboard__select__info}>
                Pour afficher la synthèse de votre PST, sélectionnez votre
                dossier de mails supprimés
            </p>
            <DashboardRecapSelectFolderItem
                type="deleted"
                pstFolderList={folderList}
            />
            <button onClick={switchView}>Valider mon choix</button>
        </div>
    );
};
