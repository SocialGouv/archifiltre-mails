import React from "react";

import {
    synthesisInputHandler,
    useSynthesisStore,
} from "../../store/SynthesisStore";
import type { FolderListItem } from "../../utils/dashboard-recap";
import style from "./OwnerFinder.module.scss";

export interface OwnerFinderBoardProps {
    title: string;
    list: FolderListItem[];
    type: "deleted" | "owner";
}

export const OwnerFinderBoard: React.FC<OwnerFinderBoardProps> = ({
    title,
    list,
    type,
}) => {
    const { owner, deletedFolder } = useSynthesisStore();
    const compareValue = type === "deleted" ? deletedFolder : owner;

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
                <button>Rechercher</button>
            </div>
            <div className={style.finder__item__board}>
                {filteredList.length ? (
                    filteredList.map((item, index) => (
                        <p
                            className={style.finder__item__board__line}
                            key={index}
                        >
                            {item.name}
                        </p>
                    ))
                ) : (
                    <p className={style.finder__item__board__empty__state}>
                        Aucun élément
                    </p>
                )}
            </div>
        </div>
    );
};
