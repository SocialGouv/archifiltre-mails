/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import type { FC } from "react";
import React from "react";
import type { RouteName } from "src/renderer/views";

import style from "./Menu.module.scss";
import type { SetIsActiveType } from "./MenuLinks";

interface MenuLinkItemProps {
    label: RouteName;
    picto: React.FC;
    active: string;
    nextRoute: RouteName;
    setIsActive: SetIsActiveType;
    changeRoute: (nextRoute: RouteName) => void;
    isCollapsed: boolean;
}

export const MenuLinkItem: FC<MenuLinkItemProps> = ({
    label,
    picto,
    active,
    nextRoute,
    isCollapsed,
    setIsActive,
    changeRoute,
}) => {
    const className =
        label === active
            ? `${style["menu-link-item"]} ${style["is-active"]}`
            : style["menu-link-item"];

    const handleClick = () => {
        setIsActive(label);
        changeRoute(nextRoute);
    };
    return (
        <div className={className} onClick={handleClick}>
            {picto}
            {isCollapsed ? null : <button>{label.toLowerCase()}</button>}
        </div>
    );
};
