/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import type { CardItemSimpleProps } from "src/renderer/utils/type";

import style from "./Card.module.scss";

export const CardSimple: React.FC<CardItemSimpleProps> = ({ opener }) => {
    return (
        <div className={style["card-simple"]} onClick={opener}>
            Bubble vizualisation
        </div>
    );
};
