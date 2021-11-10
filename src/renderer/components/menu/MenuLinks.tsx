import React, { memo, useState } from "react";
import type { RouteName } from "src/renderer/views";

import { useRouteContext } from "../../context/RouterContext";
import { EarthPicto, HistoryPicto, HomePicto } from "../common/pictos/picto";
import { MenuLinkItem } from "./MenuLinkItem";

export type SetIsActiveType = React.Dispatch<
    React.SetStateAction<"DASHBOARD" | "ECOLOGY" | "HISTORY" | "START_SCREEN">
>;

interface LinksType {
    active: string;
    changeRoute: (nextRoute: RouteName) => void;
    label: RouteName;
    nextRoute: RouteName;
    picto: React.FC;
    setIsActive: SetIsActiveType;
}

const MenuLinks: React.FC = () => {
    const [active, setIsActive] = useState<RouteName>("DASHBOARD");
    const { changeRoute } = useRouteContext();

    const links: LinksType[] = [
        {
            active,
            changeRoute,
            label: "DASHBOARD",
            nextRoute: "DASHBOARD",
            picto: <HomePicto />,
            setIsActive,
        },
        {
            active,
            changeRoute,
            label: "HISTORY",
            nextRoute: "HISTORY",
            picto: <HistoryPicto />,
            setIsActive,
        },
        {
            active,
            changeRoute,
            label: "ECOLOGY",
            nextRoute: "ECOLOGY",
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

export default memo(MenuLinks);
