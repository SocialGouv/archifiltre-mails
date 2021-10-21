import React, { useState } from "react";

import { DASHBOARD, ECOLOGY, HISTORY } from "../../../common/constants";
import { useRouteContext } from "../../context/RouterContext";
import { EarthPicto, HistoryPicto, HomePicto } from "../common/pictos/picto";
import { MenuLinkItem } from "./MenuLinkItem";

export const MenuLinks: React.FC = () => {
    const [active, setIsActive] = useState(DASHBOARD);
    const { changeRoute } = useRouteContext();
    const links = [
        {
            active,
            changeRoute,
            label: DASHBOARD,
            nextRoute: DASHBOARD,
            picto: <HomePicto />,
            setIsActive,
        },
        {
            active,
            changeRoute,
            label: HISTORY,
            nextRoute: HISTORY,
            picto: <HistoryPicto />,
            setIsActive,
        },
        {
            active,
            changeRoute,
            label: ECOLOGY,
            nextRoute: ECOLOGY,
            picto: <EarthPicto />,
            setIsActive,
        },
    ];
    return (
        <div className="menu-links">
            {links.map((link, index) => (
                <MenuLinkItem {...link} key={index} />
            ))}
        </div>
    );
};
