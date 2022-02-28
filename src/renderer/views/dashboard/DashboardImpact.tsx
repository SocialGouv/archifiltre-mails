import { bytesToMegabytes } from "@common/utils";
import type { FC } from "react";
import React from "react";
import { useTranslation } from "react-i18next";

import { Card } from "../../components/common/card/Card";
import { StaticImage } from "../../components/common/staticImage/StaticImage";
import { useImpactStore } from "../../store/ImpactStore";
import { usePstFileSizeStore } from "../../store/PstFileSizeStore";
import { usePstStore } from "../../store/PSTStore";
import {
    ECOLOGIC_IMPACT_FACTOR,
    ECOLOGIC_TRAIN_FACTOR,
} from "../../utils/constants";
import style from "./Dashboard.module.scss";

// const dashboardImpactData: DashboardImpactItemProps[] = [
//     {
//         img: "img/pictos/globe.png",
//         impactInfo: "supprimés sur 5",
//         impactNumber: "25go",
//     },
//     {
//         img: "img/pictos/money.png",
//         impactInfo: "économisés",
//         impactNumber: "50€",
//     },
//     {
//         img: "img/pictos/tree.png",
//         impactInfo: "arbres plantés",
//         impactNumber: "5",
//     },
// ];

interface DashboardImpactItemProps {
    img: string;
    impactNumber: string;
    impactInfo: string;
}
const DashboardImpactItem: FC<DashboardImpactItemProps> = ({
    img,
    impactNumber,
    impactInfo,
}) => {
    const { t } = useTranslation();
    return (
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
};

export const DashboardImpact: FC = () => {
    const { t } = useTranslation();
    const { extractTables } = usePstStore();
    const { totalFileSize } = usePstFileSizeStore();
    const { size } = useImpactStore(extractTables?.attachements);

    const megabytesToCo2EqInKilo = (totalInMo: number) =>
        (totalInMo * ECOLOGIC_IMPACT_FACTOR) / 1000;

    const cO2EqKgToTrain = (cO2eqKg: number) => cO2eqKg * ECOLOGIC_TRAIN_FACTOR;

    const computedImpactInMega = bytesToMegabytes(size);
    const cO2EqKgToDelete =
        +megabytesToCo2EqInKilo(computedImpactInMega).toFixed(2);
    const cO2EqKgByTrainInKm = +cO2EqKgToTrain(cO2EqKgToDelete).toFixed(2);

    return (
        <Card title={t("dashboard.impact.cardTitle")} color="orange">
            <div className={style.dashboard__impact}>
                <DashboardImpactItem
                    img={"img/pictos/globe.png"}
                    impactNumber={`${totalFileSize} Mo`}
                    impactInfo={t("dashboard.impact.totalSize")}
                />
                <DashboardImpactItem
                    img={"img/pictos/globe.png"}
                    impactNumber={`${t(
                        "dashboard.impact.ecologicImpactByTrain",
                        {
                            count: cO2EqKgByTrainInKm,
                        }
                    )}`}
                    impactInfo={`${t("dashboard.impact.kiloEq", {
                        count: cO2EqKgToDelete,
                    })}`}
                />
                <DashboardImpactItem
                    img={"img/pictos/globe.png"}
                    impactNumber={`${bytesToMegabytes(size)} Mo`}
                    impactInfo={"identifiés à supprimer"}
                />
            </div>
        </Card>
    );
};
