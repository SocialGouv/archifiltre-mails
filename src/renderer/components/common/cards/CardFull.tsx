/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import type { CardItemFullProps } from "src/renderer/utils/type";

import style from "./Card.module.scss";

export const CardFull: React.FC<CardItemFullProps> = ({ opener }) => {
    return (
        <div className={style["card-full"]} onClick={opener}>
            Card Full
        </div>
    );
};
