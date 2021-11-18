/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";

import { ArrowPicto } from "../common/pictos/picto";
import style from "./Menu.module.scss";

interface ArrowProps {
    className: string;
    onClick?: () => void;
}

export const Arrow: React.FC<ArrowProps> = ({ onClick, className }) => (
    <div onClick={onClick} className={`${style.arrow} ${className}`}>
        <ArrowPicto />
    </div>
);
