import type { FC } from "react";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { ExportPicto } from "../../components/common/pictos/picto";
import { toggleUserConfigPanel } from "../../store/UserConfigPanelStore";
import style from "./Dashboard.module.scss";
import { DashboardActionsExporter } from "./DashboardActionsExporter";

export const DashboardActions: FC = () => {
    const { t } = useTranslation();

    const [exporter, setExporter] = useState(false);

    const switchExporter = useCallback(() => {
        setExporter((open) => !open);
    }, [setExporter]);

    return (
        <div className={style.dashboard__actions__bar}>
            <div className={style.dashboard__actions__bar__btn}>
                <button onClick={switchExporter}>
                    <ExportPicto />
                    {t("actionBar.action.export")}
                </button>
                <DashboardActionsExporter isExporterOpen={exporter} />
            </div>
            <div className={style.dashboard__actions__bar__btn}>
                <button onClick={toggleUserConfigPanel}>
                    <ExportPicto />
                    {t("actionBar.action.config-panel")}
                </button>
            </div>
        </div>
    );
};
