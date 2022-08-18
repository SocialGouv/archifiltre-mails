import { useService } from "@common/modules/ContainerModule";
import type { FolderListItem } from "@common/modules/pst-extractor/type";
import React from "react";
import { useTranslation } from "react-i18next";

import { usePstStore } from "../../store/PSTStore";
import { useSynthesisStore } from "../../store/SynthesisStore";
import style from "./OwnerFinder.module.scss";
import { OwnerFinderBoard } from "./OwnerFinderBoard";

export interface OwnerFinderProps {
    switchFinder: () => void;
}

export const OwnerFinder: React.FC<OwnerFinderProps> = ({ switchFinder }) => {
    const { extractDatas } = usePstStore();
    const { ownerId, deletedFolderId } = useSynthesisStore();
    const trackerService = useService("trackerService");
    const { t } = useTranslation();
    if (!extractDatas) return null;

    const contactList = [...extractDatas.recipient.keys()].map(
        (contact) =>
            ({
                id: contact,
                name: contact,
            } as FolderListItem)
    );

    return (
        <section className={style.finder}>
            <OwnerFinderBoard
                title={t("dashboard.ownerfinder.board.deleted.title")}
                list={extractDatas.additionalDatas.folderList}
                type="deleted"
            />
            <OwnerFinderBoard
                title={t("dashboard.ownerfinder.board.owner.title")}
                list={contactList}
                type="owner"
            />
            <button
                className={style.finder__validate}
                onClick={() => {
                    const tracker = trackerService?.getProvider();
                    tracker?.track("Feat(1.0) Delete Folder Selected");
                    tracker?.track("Feat(2.0) Mailbox Owner Chosen");
                    switchFinder();
                }}
                disabled={!ownerId || !deletedFolderId}
            >
                {t("dashboard.ownerfinder.board.validate")}
            </button>
        </section>
    );
};
