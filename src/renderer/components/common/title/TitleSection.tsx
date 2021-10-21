import React from "react";

import style from "./Title.module.scss";

interface TitleSectionProps {
    title: string;
}

export const TitleSectionH1: React.FC<TitleSectionProps> = ({ title }) => {
    return <h1 className={style["title-section"]}>{title}</h1>;
};

export const TitleSectionH2: React.FC<TitleSectionProps> = ({ title }) => {
    return <h2 className={style["title-section"]}>{title}</h2>;
};
