import type { FC } from "react";
import React, { useCallback, useState } from "react";

import {
    ExportPicto,
    FilterPicto,
    ImportPicto,
    SearchPicto,
} from "../../components/common/pictos/picto";
import style from "./Dashboard.module.scss";
import { DashboardActionsExporter } from "./DashboardActionsExporter";

export const DashboardActions: FC = () => {
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
                    Importer
                </button>
            </div>
            <div className={style.dashboard__actions__bar__btn}>
                <button onClick={switchExporter}>
                    <ExportPicto />
                    Exporter
                </button>
                <DashboardActionsExporter isExporterOpen={exporter} />
            </div>
            <div className={style.dashboard__actions__bar__btn}>
                <button>
                    <FilterPicto />
                    Filtrer
                </button>
            </div>
        </div>
    );
};
