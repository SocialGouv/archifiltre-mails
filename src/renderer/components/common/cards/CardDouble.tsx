/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";

import style from "./Card.module.scss";

interface CardDoubleInterface {
    changeRoute: () => void;
}

export const CardDouble: React.FC<CardDoubleInterface> = ({ changeRoute }) => {
    return (
        <div className={style["card-double"]} onClick={changeRoute}>
            Card Double
        </div>
    );
};
