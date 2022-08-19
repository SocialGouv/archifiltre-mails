import type { FC } from "react";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { Card } from "../../components/common/card/Card";
import { OwnerFinder } from "../../components/owner-finder/OwnerFinder";
import { OwnerFinderLanding } from "../../components/owner-finder/OwnerFinderLanding";
import { DashboardRecapItems } from "./DashboardRecapItems";

export const DashboardRecap: FC = () => {
    const { t } = useTranslation();
    const [isRecapReady, setIsRecapReady] = useState(false);
    const [isFinder, setIsFinder] = useState(false);

    const switchRecapOn = useCallback(() => {
        setIsRecapReady(true);
    }, []);

    const switchFinder = useCallback(() => {
        setIsFinder(!isFinder);
    }, [isFinder]);

    return (
        <Card title={t("dashboard.recap.cardTitle")} color="blue">
            {isRecapReady ? (
                <DashboardRecapItems />
            ) : isFinder ? (
                <OwnerFinder switchFinder={switchRecapOn} />
            ) : (
                <OwnerFinderLanding switchView={switchFinder} />
            )}
        </Card>
    );
};
