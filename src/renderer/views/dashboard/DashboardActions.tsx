import { useService } from "@common/modules/ContainerModule";
import type { FC } from "react";
import React, { useCallback, useState } from "react";
import type { TFunction } from "react-i18next";
import { useTranslation } from "react-i18next";

import { CogPicto, ExportPicto } from "../../components/common/pictos/picto";
import { useAutoUpdateContext } from "../../context/AutoUpdateContext";
import type { WorkManagerService } from "../../services/WorkManagerService";
import { toggleUserConfigPanel } from "../../store/UserConfigPanelStore";
import { dialog } from "../../utils/electron";
import style from "./Dashboard.module.scss";
import { DashboardActionsExporter } from "./DashboardActionsExporter";

const doSaveWork = async (
    t: TFunction,
    workManagerService: WorkManagerService
) => {
    const dialogPath = await dialog.showSaveDialog({
        filters: [
            {
                extensions: [".json"],
                name: t("exporter.save.filterName", { type: ".json" }),
            },
        ],
        message: t("exporter.save.message"),
        nameFieldLabel: t("exporter.save.nameFieldLabel"),
        showsTagField: false,
        title: t("exporter.save.title", { type: ".json" }),
    });

    if (dialogPath.canceled || !dialogPath.filePath) {
        return;
    }

    await workManagerService.save({
        dest: dialogPath.filePath,
    });
};

export const DashboardActions: FC = () => {
    const { t } = useTranslation();

    const [exporter, setExporter] = useState(false);

    const { updateInfo } = useAutoUpdateContext();

    const workManagerService = useService("workManagerService");

    const switchExporter = useCallback(() => {
        setExporter((open) => !open);
    }, [setExporter]);

    const saveWork = useCallback(async () => {
        console.log("SAVE WORK");
        if (!workManagerService) return;
        console.log("GO !");

        const dialogPath = await dialog.showSaveDialog({
            filters: [
                {
                    extensions: [".json"],
                    name: t("exporter.save.filterName", { type: ".json" }),
                },
            ],
            message: t("exporter.save.message"),
            nameFieldLabel: t("exporter.save.nameFieldLabel"),
            showsTagField: false,
            title: t("exporter.save.title", { type: ".json" }),
        });

        if (dialogPath.canceled || !dialogPath.filePath) {
            return;
        }

        await workManagerService.save({
            dest: dialogPath.filePath,
        });
    }, [t, workManagerService]);

    return (
        <div className={style.dashboard__actions__bar}>
            <div className={style.dashboard__actions__bar__btn}>
                <button onClick={saveWork}>
                    <ExportPicto />
                    SAVE
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
