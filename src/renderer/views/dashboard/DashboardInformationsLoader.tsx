import React from "react";
import { useTranslation } from "react-i18next";

import { Card } from "../../components/common/card/Card";
import { Loader } from "../../components/common/loader";

export const DashboardInformationsLoader: React.FC = () => {
    const { t } = useTranslation();
    return (
        <Loader>
            <Card title="Informations" color="green">
                <p>{t("dashboard.informations.emptyInfos")}</p>
            </Card>
        </Loader>
    );
};
