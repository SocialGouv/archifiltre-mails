import React from "react";

import { setMailBoxOwner, useSynthesisStore } from "../../store/SynthesisStore";
import type { FolderListItem } from "../../utils/dashboard-recap";
import style from "./OwnerFinder.module.scss";

export interface OwnerFinderBoardProps {
    title: string;
    list: FolderListItem[];
}

export const OwnerFinderBoard: React.FC<OwnerFinderBoardProps> = ({
    title,
    list,
}) => {
    const { owner } = useSynthesisStore();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMailBoxOwner(event.target.value.toLowerCase());
    };

    const filteredList = list.filter((item) =>
        item.name.toLowerCase().includes(owner)
    );

    return (
        <div className={style.finder__item}>
            <h1>{title}</h1>
            <div className={style.finder__item__search}>
                <input onChange={handleChange} value={owner} />
                <button>Rechercher</button>
            </div>
            <div className={style.finder__item__board}>
                {filteredList.length
                    ? filteredList.map((item, index) => (
                          <p
                              className={style.finder__item__board__line}
                              key={index}
                          >
                              {item.name}
                          </p>
                      ))
                    : "rien"}
            </div>
        </div>
    );
};
