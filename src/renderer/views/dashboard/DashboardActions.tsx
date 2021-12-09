import type { FC } from "react";
import React from "react";

import {
    ExportPicto,
    FilterPicto,
    ImportPicto,
    SearchPicto,
} from "../../../renderer/components/common/pictos/picto";
import style from "./Dashboard.module.scss";

export const DashboardActions: FC = () => {
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
                <button>
                    <ExportPicto />
                    Exporter
                </button>
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
