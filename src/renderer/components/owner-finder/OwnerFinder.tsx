import React from "react";

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
                title="Sélectionner le dossier des mails supprimés"
                list={folderList}
                type="deleted"
            />
            <OwnerFinderBoard
                title="Sélectionner l'adresse associée à cette messagerie"
                list={contactList}
                type="owner"
            />
            <button
                className={style.finder__validate}
                onClick={switchFinder}
                disabled={!ownerId || !deletedFolderId}
            >
                Valider mon choix
            </button>
        </section>
    );
};
