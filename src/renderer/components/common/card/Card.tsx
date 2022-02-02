import type { FC } from "react";
import React from "react";

import { COLORS } from "../../../utils/constants";
import style from "./Card.module.scss";

const {
    CARD_LABEL_BLUE,
    CARD_LABEL_GREEN,
    CARD_LABEL_GREY,
    CARD_LABEL_ORANGE,
    CARD_LABEL_PURPLE,
} = COLORS;

interface CardProps {
    title: string;
    className?: string;
    color?:
        | typeof CARD_LABEL_BLUE
        | typeof CARD_LABEL_GREEN
        | typeof CARD_LABEL_GREY
        | typeof CARD_LABEL_ORANGE
        | typeof CARD_LABEL_PURPLE;
}

export const Card: FC<CardProps> = ({
    children,
    title,
    className,
    color = CARD_LABEL_GREY,
}) => {
    const cardClassName = className
        ? `${style.card} ${style.className}`
        : `${style.card}`;
    return (
        <div className={cardClassName}>
            <div className={style.card__title}>
                <div
                    className={`${style.card__title__color} ${style[color]}`}
                />
                <div className={style.card__title__txt}>{title}</div>
            </div>
            {children}
        </div>
    );
};
