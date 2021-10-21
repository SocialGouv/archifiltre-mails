/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";

import style from "./Card.module.scss";

interface CardFullInterface {
    changeRoute: () => void;
}

export const CardFull: React.FC<CardFullInterface> = ({ changeRoute }) => {
    return (
        <div className={style["card-full"]} onClick={changeRoute}>
            Card Full
        </div>
    );
};
