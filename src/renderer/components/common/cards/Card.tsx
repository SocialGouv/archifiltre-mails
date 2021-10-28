import React from "react";

import { CARD_DOUBLE, CARD_FULL, CARD_SIMPLE } from "../../../utils/constants";
import { CardDouble } from "./CardDouble";
import { CardFull } from "./CardFull";
import { CardSimple } from "./CardSimple";

interface CardProps {
    type: string;
    opener?: () => void;
}

export const Card: React.FC<CardProps> = ({ type, opener }) => {
    switch (type) {
        case CARD_SIMPLE:
            return <CardSimple opener={opener} />;
        case CARD_DOUBLE:
            return <CardDouble opener={opener} />;
        case CARD_FULL:
            return <CardFull opener={opener} />;

        default:
            throw new Error("You need to choose one type!");
    }
};
