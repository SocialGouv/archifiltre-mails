import React from "react";
import { useTranslation } from "react-i18next";

import { usePstStore } from "../../store/PSTStore";
import { useSynthesisStore } from "../../store/SynthesisStore";
import type { FolderListItem } from "../../utils/dashboard-recap";
import { getPstListOfFolder } from "../../utils/dashboard-recap";
import style from "./OwnerFinder.module.scss";
import { OwnerFinderBoard } from "./OwnerFinderBoard";

export interface OwnerFinderProps {
    switchFinder: () => void;
}

export const OwnerFinder: React.FC<OwnerFinderProps> = ({ switchFinder }) => {
    const { pstFile, extractTables } = usePstStore();
    const { ownerId, deletedFolderId } = useSynthesisStore();
    const { t } = useTranslation();
    if (!pstFile || !extractTables) return null;

    const folderList = getPstListOfFolder(pstFile.children);
    const contactList = [...extractTables.contacts.keys()].map(
        (contact) =>
            ({
                id: contact,
                name: contact,
                type: "",
            } as FolderListItem)
    );

    return (
        <section className={style.finder}>
            <OwnerFinderBoard
                title={t("dashboard.ownerfinder.board.deleted.title")}
                list={folderList}
                type="deleted"
            />
            <OwnerFinderBoard
                title={t("dashboard.ownerfinder.board.owner.title")}
                list={contactList}
                type="owner"
            />
            <button
                className={style.finder__validate}
                onClick={switchFinder}
                disabled={!ownerId || !deletedFolderId}
            >
                {t("dashboard.ownerfinder.board.validate")}
            </button>
        </section>
    );
};
