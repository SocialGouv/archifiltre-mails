import React from "react";

import style from "./Title.module.scss";

interface TitleProps {
    title: string;
}

export const TitleH1: React.FC<TitleProps> = ({ title }) => {
    return <h1 className={style["title-section"]}>{title}</h1>;
};

export const TitleH2: React.FC<TitleProps> = ({ title }) => {
    return <h2 className={style["title-section"]}>{title}</h2>;
};
