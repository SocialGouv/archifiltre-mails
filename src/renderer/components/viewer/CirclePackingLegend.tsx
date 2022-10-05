/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from "react";

import style from "./CirclePacking.module.scss";

export const CirclePackingLegend: React.FC = () => {
    const [isOpen, setIsopen] = useState(true);
    const toggle = () => {
        setIsopen(!isOpen);
    };

    // TODO: 2 niveau de lecture ==> interaction / display (catégorie) + déplacer en bas
    return isOpen ? (
        <div className={style.circlePackingLegendOpen} onClick={toggle}>
            <div>
                <ul>
                    <h2>Légende du visualiseur</h2>
                    <li>
                        <small data-name="global" /> Parent de l'élément affiché
                    </li>
                    <li>
                        <small data-name="inside" /> Élément non taggué
                    </li>
                    <li>
                        <small data-name="delete" /> Élément taggué à supprimer
                    </li>
                    <li>
                        <small data-name="keep" /> Élément taggué à conserver
                    </li>
                    <li>
                        <small data-name="months" />
                        Date : du plus clair (janvier) au plus foncé (décembre)
                    </li>
                    <li>
                        <small data-name="sent" /> Mail envoyé
                    </li>
                    <li>
                        <small data-name="focus" /> Mail séléctionné
                    </li>
                </ul>
            </div>
        </div>
    ) : (
        <div className={style.circlePackingLegend} onClick={toggle}>
            i
        </div>
    );
};
