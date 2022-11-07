import { useService } from "@common/modules/ContainerModule";
import type { UncachedAdditionalDatas } from "@common/modules/work-manager/type";
import { randomUUID } from "crypto";
import type { FC } from "react";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { CogPicto, ExportPicto } from "../../components/common/pictos/picto";
import { useAutoUpdateContext } from "../../context/AutoUpdateContext";
import { useSynthesisStore } from "../../store/SynthesisStore";
import { tagManagerStore } from "../../store/TagManagerStore";
import { toggleUserConfigPanel } from "../../store/UserConfigPanelStore";
import { dialog } from "../../utils/electron";
import style from "./Dashboard.module.scss";
import { DashboardActionsExporter } from "./DashboardActionsExporter";

export const DashboardActions: FC = () => {
    const { t } = useTranslation();
    const [exporter, setExporter] = useState(false);
    const { updateInfo } = useAutoUpdateContext();
    const workManagerService = useService("workManagerService");
    const { ownerId, deletedFolderId } = useSynthesisStore();
    const { keepIds, deleteIds } = tagManagerStore();
    const trackerService = useService("trackerService");

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
            message: t("exporter.save.message-work-in-progress"),
            nameFieldLabel: t("exporter.save.nameFieldLabel"),
            showsTagField: false,
            title: t("exporter.save.title", { type: ".json" }),
        });

        if (dialogPath.canceled || !dialogPath.filePath) {
            return;
        }

        const workHash = randomUUID();

        const uncachedAdditionalDatas: UncachedAdditionalDatas = {
            deleteIds,
            deletedFolderId,
            keepIds,
            ownerId,
            workHash,
        };

        await workManagerService.save({
            dest: dialogPath.filePath,
            uncachedAdditionalDatas,
        });
        trackerService?.getProvider().track("Work Saved", { workHash });
    }, [
        deleteIds,
        deletedFolderId,
        keepIds,
        ownerId,
        t,
        workManagerService,
        trackerService,
    ]);

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
