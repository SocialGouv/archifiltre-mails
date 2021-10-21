/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import type { FC, ReactNode } from "react";
import React from "react";

import style from "./MenuLink.module.scss";

interface MenuLinkItemProps {
    label: string;
    picto: ReactNode;
    active: string;
    nextRoute: string;
    setIsActive: (label: string) => void;
    changeRoute: (nextRoute: string) => void;
}

export const MenuLinkItem: FC<MenuLinkItemProps> = ({
    label,
    picto,
    active,
    nextRoute,
    setIsActive,
    changeRoute,
}) => {
    const classname =
        label === active
            ? `${style["menu-link-item"]} ${style["is-active"]}`
            : style["menu-link-item"];

    const handleClick = () => {
        setIsActive(label);
        changeRoute(nextRoute);
    };
    return (
        <div className={classname} onClick={handleClick}>
            {picto}
            <button>{label}</button>
        </div>
    );
};
