import React from "react";

import { TitleSectionH2 } from "../title/TitleSection";
import style from "./Card.module.scss";

interface CardSectionProps {
    title: string;
}

export const CardSection: React.FC<CardSectionProps> = ({
    children,
    title,
}) => {
    return (
        <div className={style["card-section"]}>
            <TitleSectionH2 title={title} />
            <div className={style["card-group"]}>{children}</div>
        </div>
    );
};
