import { useService } from "@common/modules/ContainerModule";
import type {
    ExporterAsFileType,
    ExporterAsFolderType,
} from "@common/modules/FileExporterModule";
import { createToast } from "@common/utils";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { usePstStore } from "../store/PSTStore";
import { tagManagerStore } from "../store/TagManagerStore";
import { dialog } from "../utils/electron";

interface UseExporter {
    openSaveFileDialog: (type: ExporterAsFileType) => pvoid;
    openSaveFolderDialog: (type: ExporterAsFolderType) => pvoid;
}

export const useExporter = (): UseExporter => {
    const pstExporterService = useService("pstExporterService");
    const { t } = useTranslation();
    const { deleteIds: deletedIds } = tagManagerStore();
    const { extractDatas } = usePstStore();

    const openSaveFileDialog = useCallback(
        async (type: ExporterAsFileType) => {
            if (!pstExporterService || !extractDatas) {
                return;
            }

            const dialogPath = await dialog.showSaveDialog({
                filters: [
                    {
                        extensions: [type],
                        name: t("exporter.save.filterName", { type }),
                    },
                ],
                message: t("exporter.save.message"),
                nameFieldLabel: t("exporter.save.nameFieldLabel"),
                showsTagField: false,
                title: t("exporter.save.title", { type }),
            });

            if (dialogPath.canceled || !dialogPath.filePath) {
                createToast(
                    t("notification.export.cancel", { type }),
                    "warning"
                );
                return;
            }

            await pstExporterService.exportMails({
                deletedIds,
                dest: dialogPath.filePath,
                type,
            });

            createToast(t("notification.export.save", { type }), "success");
        },
        [t, extractDatas, pstExporterService, deletedIds]
    );

    const openSaveFolderDialog = useCallback(
        async (type: ExporterAsFolderType) => {
            if (!pstExporterService || !extractDatas) return;

            const result = await dialog.showOpenDialog({
                message: t("exporter.save.message"),
                properties: ["openDirectory"],
                title: t("exporter.save.title", { type }),
            });

            const dest = result.filePaths[0];
            if (!dest) {
                createToast(
                    t("notification.export.cancel", { type }),
                    "warning"
                );
                return;
            }

            await pstExporterService.exportMails({ dest, type });
            createToast(t("notification.export.save", { type }), "success");
        },
        [t, extractDatas, pstExporterService]
    );

    return {
        openSaveFileDialog,
        openSaveFolderDialog,
    };
};
