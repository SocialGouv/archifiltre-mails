import React from "react";

import { CardSection } from "../../components/common/cards/CardSection";
import { TitleSectionH1 } from "../../components/common/title/TitleSection";
import style from "./Dashboard.module.scss";

export const DashboardGeneral: React.FC = () => {
    return (
        <div className={style.general}>
            <TitleSectionH1 title="Général" />
            <CardSection title="Chiffres clés">
                {/* <Card type={CARD_SIMPLE} route={BUBBLE} />
                <Card type={CARD_DOUBLE} route={BUBBLE} />
                <Card type={CARD_SIMPLE} route={BUBBLE} /> */}
            </CardSection>
        </div>
    );
};
