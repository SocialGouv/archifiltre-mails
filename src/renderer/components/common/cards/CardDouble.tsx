/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import type { CardItemDoubleProps } from "src/renderer/utils/type";

import style from "./Card.module.scss";

export const CardDouble: React.FC<CardItemDoubleProps> = ({ opener }) => {
    return (
        <div className={style["card-double"]} onClick={opener}>
            Card Double
        </div>
    );
};
