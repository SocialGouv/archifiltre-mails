import type { FC } from "react";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { CogPicto, ExportPicto } from "../../components/common/pictos/picto";
import { useAutoUpdateContext } from "../../context/AutoUpdateContext";
import { toggleUserConfigPanel } from "../../store/UserConfigPanelStore";
import style from "./Dashboard.module.scss";
import { DashboardActionsExporter } from "./DashboardActionsExporter";

export const DashboardActions: FC = () => {
    const { t } = useTranslation();

    const [exporter, setExporter] = useState(false);

    const { updateInfo } = useAutoUpdateContext();

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
                <button
                    onClick={toggleUserConfigPanel}
                    className={
                        updateInfo
                            ? style.dashboard__actions__bar__btn__userconfig__update__available
                            : style.dashboard__actions__bar__btn__userconfig
                    }
                >
                    <CogPicto />
                    {t("actionBar.action.config-panel")}
                </button>
            </div>
        </div>
    );
};
