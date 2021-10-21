import React from "react";

import {
    CARD_DOUBLE,
    CARD_FULL,
    CARD_SIMPLE,
} from "../../../../common/constants";
import { useWorkspaceRouteContext } from "../../../context/WorkspaceRouter";
import { CardDouble } from "./CardDouble";
import { CardFull } from "./CardFull";
import { CardSimple } from "./CardSimple";

export const Card: React.FC<{ type: string; route: string }> = ({
    type,
    route,
}) => {
    const { changeWorkspaceRoute, backHome } = useWorkspaceRouteContext();

    const changeRoute = () => {
        changeWorkspaceRoute(route);
    };

    switch (type) {
        case CARD_SIMPLE:
            return <CardSimple changeRoute={changeRoute} />;
        case CARD_DOUBLE:
            return <CardDouble changeRoute={backHome} />;
        case CARD_FULL:
            return <CardFull changeRoute={backHome} />;

        default:
            throw new Error("you need to choose one type!");
    }
};
