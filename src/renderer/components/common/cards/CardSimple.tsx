/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";

import style from "./Card.module.scss";

interface CardSimpleInterface {
    changeRoute: () => void;
}

export const CardSimple: React.FC<CardSimpleInterface> = ({ changeRoute }) => {
    return (
        <div className={style["card-simple"]} onClick={changeRoute}>
            Card Simple
        </div>
    );
};
