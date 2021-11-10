import React from "react";

import { Logo } from "../common/logo/Logo";
import style from "./Menu.module.scss";
import MenuLinks from "./MenuLinks";

export const Menu: React.FC = () => (
    <nav id={style.menu}>
        <Logo />
        <MenuLinks />
    </nav>
);
