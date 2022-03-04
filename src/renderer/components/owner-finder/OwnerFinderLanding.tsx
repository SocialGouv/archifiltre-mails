import React from "react";
import { useTranslation } from "react-i18next";

import style from "./OwnerFinder.module.scss";

interface OwnerFinderLandingProps {
    switchView: () => void;
}

export const OwnerFinderLanding: React.FC<OwnerFinderLandingProps> = ({
    switchView,
}) => {
    const { t } = useTranslation();
    return (
        <div className={style.finder__landing}>
            <p>{t("dashboard.ownerfinder.landing.info")}</p>
            <button onClick={switchView}>
                {t("dashboard.ownerfinder.landing.start")}
            </button>
        </div>
    );
};
