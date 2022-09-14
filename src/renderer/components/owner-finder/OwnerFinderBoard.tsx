/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import type { AddtionalDataItem } from "@common/modules/pst-extractor/type";
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
    list: AddtionalDataItem[];
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
    const compareValueName = type === "deleted" ? deletedFolderName : ownerName;
    const compareValueId = type === "deleted" ? deletedFolderId : ownerId;
    const filteredList = list.filter((item) =>
        item.name.toLowerCase().includes(compareValueName)
    );

    return (
        <div className={style.finder__item}>
            <h1>{title}</h1>
            <div className={style.finder__item__search}>
                <input
                    onChange={(event) => {
                        synthesisInputHandler(event, type);
                    }}
                    value={compareValueName}
                    placeholder={t("dashboard.ownerfinder.board.search")}
                />
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
                            <span
                                className={
                                    style.finder__item__board__line__id__info
                                }
                                title={item.id}
                            >
                                ({item.id})
                            </span>
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
