import { bytesToMegabytes } from "@common/utils";
import type { FC } from "react";
import React from "react";
import { useTranslation } from "react-i18next";

import { StaticImage } from "../../components/common/staticImage/StaticImage";
import { useImpactStore } from "../../store/ImpactStore";
import { pstContentCounterPerLevelStore } from "../../store/PstContentCounterPerLevelStore";
import {
    ECOLOGIC_IMPACT_FACTOR,
    ECOLOGIC_TRAIN_FACTOR,
} from "../../utils/constants";
import style from "./Dashboard.module.scss";

interface DashboardImpactItemProps {
    img: string;
    impactInfo: string;
    impactNumber: string;
}
const DashboardImpactItem: FC<DashboardImpactItemProps> = ({
    img,
    impactNumber,
    impactInfo,
}) => {
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
    const { totalArchiveSize } = pstContentCounterPerLevelStore();
    const { deleteSize } = useImpactStore();

    const megabytesToCo2EqInKilo = (totalInMo: number) =>
        (totalInMo * ECOLOGIC_IMPACT_FACTOR) / 1000;

    const cO2EqKgToTrain = (cO2eqKg: number) => cO2eqKg * ECOLOGIC_TRAIN_FACTOR;

    const computedImpactInMega = bytesToMegabytes(deleteSize);
    const cO2EqKgToDelete = Math.round(
        megabytesToCo2EqInKilo(computedImpactInMega)
    );

    const cO2EqKgByTrainInKm = Math.round(cO2EqKgToTrain(cO2EqKgToDelete));

    return (
        <div className={style.dashboard__impact}>
            <div className={style.dashboard__impact__inner}>
                <DashboardImpactItem
                    img={"img/pictos/globe.png"}
                    impactNumber={`${totalArchiveSize} Mo`}
                    impactInfo={t("dashboard.impact.totalSize")}
                />
                <DashboardImpactItem
                    img={"img/pictos/desktop.png"}
                    impactNumber={`${bytesToMegabytes(deleteSize)} Mo`}
                    impactInfo={t("dashboard.impact.identify")}
                />
                <DashboardImpactItem
                    img={"img/pictos/train.png"}
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
            </div>
        </div>
    );
};
