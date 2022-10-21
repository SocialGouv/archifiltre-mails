import type { FC } from "react";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Card } from "../../components/common/card/Card";
import { OwnerFinder } from "../../components/owner-finder/OwnerFinder";
import { OwnerFinderLanding } from "../../components/owner-finder/OwnerFinderLanding";
import { useSynthesisStore } from "../../store/SynthesisStore";
import { DashboardRecapItems } from "./DashboardRecapItems";

export const DashboardRecap: FC = () => {
    const { t } = useTranslation();
    const { ownerId } = useSynthesisStore();
    const [isRecapReady, setIsRecapReady] = useState(false);
    const [isFinder, setIsFinder] = useState(false);

    useEffect(() => {
        if (ownerId) {
            setIsRecapReady(true);
            setIsFinder(true);
        }
    }, [ownerId]);

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
