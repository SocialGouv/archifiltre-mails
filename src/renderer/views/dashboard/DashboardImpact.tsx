import type { FC } from "react";
import React from "react";
import { useTranslation } from "react-i18next";

import { Card } from "../../components/common/card/Card";
import { StaticImage } from "../../components/common/staticImage/StaticImage";
import { useImpactStore } from "../../store/ImpactStore";
import { usePstStore } from "../../store/PSTStore";
import style from "./Dashboard.module.scss";

const dashboardImpactData: DashboardImpactItemProps[] = [
    {
        img: "img/pictos/globe.png",
        impactInfo: "supprimés sur 5",
        impactNumber: "25go",
    },
    {
        img: "img/pictos/money.png",
        impactInfo: "économisés",
        impactNumber: "50€",
    },
    {
        img: "img/pictos/tree.png",
        impactInfo: "arbres plantés",
        impactNumber: "5",
    },
];

interface DashboardImpactItemProps {
    img: string;
    impactNumber: string;
    impactInfo: string;
}
const DashboardImpactItem: FC<DashboardImpactItemProps> = ({
    img,
    impactNumber,
    impactInfo,
}) => (
    <div className={style.dashboard__impact__item}>
        <div className={style.dashboard__impact__item__picto}>
            <StaticImage src={img} alt="globe" />
        </div>
        <div className={style.dashboard__impact__item__infos}>
            <span>{impactNumber}</span>
            <span>{impactInfo}</span>
        </div>
    </div>
);

export const DashboardImpact: FC = () => {
    const { t } = useTranslation();
    const { extractTables } = usePstStore();
    const { size } = useImpactStore(extractTables?.attachements);

    return (
        <Card title={t("dashboard.impact.cardTitle")} color="orange">
            <span>{size}</span>
            <div className={style.dashboard__impact}>
                {dashboardImpactData.map((impact, index) => (
                    <DashboardImpactItem key={index} {...impact} />
                ))}
            </div>
        </Card>
    );
};
