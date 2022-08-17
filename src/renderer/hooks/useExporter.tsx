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
    openSaveFileDialog: (type: ExporterAsFileType) => Promise<void>;
    openSaveFolderDialog: (type: ExporterAsFolderType) => Promise<void>;
}

export const useExporter = (): UseExporter => {
    const fileExporterService = useService("fileExporterService");
    const { t } = useTranslation();
    const { toDeleteIDs } = useImpactStore();
    const { extractDatas } = usePstStore();

    const openSaveFileDialog = useCallback(
        async (type: ExporterAsFileType) => {
            if (!fileExporterService || !extractDatas) {
                return;
            }

            // const mailsWithTags = getMailsWithTag(
            //     extractDatas.indexes,
            //     toDeleteIDs
            // );

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

            // const mails = formatEmailTable(mailsWithTags);
            // await fileExporterService.export(type, mails, dialogPath.filePath);
        },
        [t, extractDatas, fileExporterService, toDeleteIDs]
    );

    const openSaveFolderDialog = useCallback(
        async (type: ExporterAsFolderType) => {
            if (!fileExporterService || !extractDatas) return;

            const result = await dialog.showOpenDialog({
                properties: ["openDirectory"],
            });

            const chosenFile = result.filePaths[0];
            if (!chosenFile) {
                // TODO: handle error maybe?
                return;
            }

            // await fileExporterService.export(type, pstFile, chosenFile);
        },
        [fileExporterService, extractDatas]
    );

    return {
        openSaveFileDialog,
        openSaveFolderDialog,
    };
};
