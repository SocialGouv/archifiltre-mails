import type { FC } from "react";
import React from "react";

import style from "./Card.module.scss";

interface CardProps {
    title: string;
    className?: string;
    color?: "blue" | "green" | "grey" | "orange" | "purple";
}

export const Card: FC<CardProps> = ({
    children,
    title,
    className,
    color = "grey",
}) => {
    const _className = className
        ? `${style.card} ${style.className}`
        : `${style.card}`;
    return (
        <div className={_className}>
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
