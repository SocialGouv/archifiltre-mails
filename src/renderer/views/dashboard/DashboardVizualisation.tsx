import React, { useCallback, useState } from "react";

import { Card } from "../../components/common/cards/Card";
import { CardSection } from "../../components/common/cards/CardSection";
import { TitleSectionH1 } from "../../components/common/title/TitleSection";
import { Bubble } from "../../components/vizualisation/Bubble";
import { BUBBLE, CARD_SIMPLE } from "../../utils/constants";
import style from "./Dashboard.module.scss";

export const DashboardVizualisation: React.FC = () => {
    const [vizualisation, setVizualisation] = useState<string | null>(null);
    const IS_BUBBLE = vizualisation === BUBBLE;

    const openBubbleVizualisation = useCallback(() => {
        setVizualisation(BUBBLE);
    }, []);

    const closeVizualisation = useCallback(() => {
        setVizualisation(null);
    }, []);

    return (
        <div className={style.general}>
            <TitleSectionH1 title="Visualisation" />
            <CardSection title="Visualisation">
                <Card type={CARD_SIMPLE} opener={openBubbleVizualisation} />
                <Card type={CARD_SIMPLE} />
            </CardSection>
            {IS_BUBBLE && <Bubble closer={closeVizualisation} />}
        </div>
    );
};
