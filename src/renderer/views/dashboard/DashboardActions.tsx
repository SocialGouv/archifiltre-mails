import type { FC } from "react";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import {
    ExportPicto,
    FilterPicto,
    ImportPicto,
    SearchPicto,
} from "../../components/common/pictos/picto";
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
            <div className={style.dashboard__actions__search}>
                <SearchPicto /> mots-clés
            </div>
            <div className={style.dashboard__actions__bar__btn}>
                <button>
                    <ImportPicto />
                    {t("actionBar.action.import")}
                </button>
            </div>
            <div className={style.dashboard__actions__bar__btn}>
                <button onClick={switchExporter}>
                    <ExportPicto />
                    {t("actionBar.action.export")}
                </button>
                <DashboardActionsExporter isExporterOpen={exporter} />
            </div>
            <div className={style.dashboard__actions__bar__btn}>
                <button>
                    <FilterPicto />
                    {t("actionBar.action.filter")}
                </button>
            </div>
        </div>
    );
};
