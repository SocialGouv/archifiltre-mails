import React from "react";
import { useTranslation } from "react-i18next";

import { Loader } from "../../components/common/loader";

export const DashboardInformationsLoader: React.FC = () => {
    const { t } = useTranslation();
    return (
        <Loader>
            <div style={{ margin: "0 0 1rem" }}>
                <strong>{t("dashboard.informations.elementRollover")} :</strong>
            </div>
            <p>{t("dashboard.informations.emptyInfos")}</p>
        </Loader>
    );
};
