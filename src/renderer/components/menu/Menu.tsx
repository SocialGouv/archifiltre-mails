import React, { useCallback, useState } from "react";

import { Logo } from "../common/logo/Logo";
import style from "./Menu.module.scss";
import { Arrow } from "./MenuArrow";
import MenuLinks from "./MenuLinks";

export const Menu: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const collapseMenu = () => {
        setIsCollapsed((state) => !state);
    };

    const getCollapsedClassName = useCallback(
        (className: string) =>
            isCollapsed
                ? `${style[className]} ${style["is-collapsed"]}`
                : `${style[className]}`,
        [isCollapsed]
    );

    return (
        <nav className={getCollapsedClassName("menu")}>
            <Arrow
                onClick={collapseMenu}
                className={getCollapsedClassName("arrow")}
            />
            <Logo />
            <MenuLinks isCollapsed={isCollapsed} />
        </nav>
    );
};
