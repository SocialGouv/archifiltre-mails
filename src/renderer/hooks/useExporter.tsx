import { useService } from "@common/modules/ContainerModule";
import type {
    ExporterAsFileType,
    ExporterAsFolderType,
} from "@common/modules/FileExporterModule";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useImpactStore } from "../store/ImpactStore";
import { usePstStore } from "../store/PSTStore";
import { dialog } from "../utils/electron";

interface UseExporter {
    openSaveFileDialog: (type: ExporterAsFileType) => pvoid;
    openSaveFolderDialog: (type: ExporterAsFolderType) => pvoid;
}

export const useExporter = (): UseExporter => {
    const pstExporterService = useService("pstExporterService");
    const { t } = useTranslation();
    const { toDeleteIDs } = useImpactStore();
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
                return;
            }

            await pstExporterService.exportMails({
                deletedIds: [...toDeleteIDs],
                dest: dialogPath.filePath,
                type,
            });
        },
        [t, extractDatas, pstExporterService, toDeleteIDs]
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
                // TODO: handle error maybe?
                return;
            }

            await pstExporterService.exportMails({ dest, type });
        },
        [t, extractDatas, pstExporterService]
    );

    return {
        openSaveFileDialog,
        openSaveFolderDialog,
    };
};
