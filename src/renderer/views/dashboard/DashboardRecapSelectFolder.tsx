import type { FC } from "react";
import React from "react";

import { usePSTFolderList } from "../../hooks/usePSTFolderList";
import style from "./Dashboard.module.scss";
import { DashboardRecapSelectFolderItem } from "./DashboardRecapSelectFolderItem";

interface DashboardRecapSelectFolderProps {
    switchView: () => void;
}

export const DashboardRecapSelectFolder: FC<
    DashboardRecapSelectFolderProps
> = ({ switchView }) => {
    const { folderList } = usePSTFolderList();

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
