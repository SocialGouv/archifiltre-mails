/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import type { FolderListItem } from "@common/modules/pst-extractor/type";
import React from "react";
import { useTranslation } from "react-i18next";

import type { SynthesisType } from "../../store/SynthesisStore";
import {
    synthesisIdHandler,
    synthesisInputHandler,
    useSynthesisStore,
} from "../../store/SynthesisStore";
import style from "./OwnerFinder.module.scss";

export interface OwnerFinderBoardProps {
    list: FolderListItem[];
    title: string;
    type: SynthesisType;
}

export const OwnerFinderBoard: React.FC<OwnerFinderBoardProps> = ({
    title,
    list,
    type,
}) => {
    const { t } = useTranslation();
    const { ownerName, deletedFolderName, deletedFolderId, ownerId } =
        useSynthesisStore();
    const compareValue = type === "deleted" ? deletedFolderName : ownerName;
    const compareValueId = type === "deleted" ? deletedFolderId : ownerId;
    const filteredList = list.filter((item) =>
        item.name.toLowerCase().includes(compareValue)
    );

    return (
        <div className={style.finder__item}>
            <h1>{title}</h1>
            <div className={style.finder__item__search}>
                <input
                    onChange={(event) => {
                        synthesisInputHandler(event, type);
                    }}
                    value={compareValue}
                />
                <button>{t("dashboard.ownerfinder.board.search")}</button>
            </div>
            <div className={style.finder__item__board}>
                {filteredList.length ? (
                    filteredList.map((item, index) => (
                        <p
                            className={
                                item.id === compareValueId
                                    ? style.finder__item__board__line__active
                                    : style.finder__item__board__line
                            }
                            id={item.id}
                            onClick={(event) => {
                                synthesisIdHandler(event, type);
                            }}
                            key={index}
                        >
                            {item.name}
                        </p>
                    ))
                ) : (
                    <p className={style.finder__item__board__empty__state}>
                        {t("dashboard.ownerfinder.board.noElement")}
                    </p>
                )}
            </div>
        </div>
    );
};
