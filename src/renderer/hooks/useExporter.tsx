import { useService } from "@common/modules/ContainerModule";
import type { ExporterType } from "@common/modules/FileExporterModule";
import { formatEmailTable, getMailsWithTag } from "@common/utils/exporter";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useImpactStore } from "../store/ImpactStore";
import { usePstStore } from "../store/PSTStore";
import { dialog } from "../utils/electron";

interface UseExporter {
    emlExport: () => Promise<void>;
    openSaveDialog: (type: ExporterType) => void;
}

export const useExporter = (): UseExporter => {
    const fileExporterService = useService("fileExporterService");
    const { t } = useTranslation();
    const { toDeleteIDs } = useImpactStore();
    const { extractTables, pstFile } = usePstStore();

    const openSaveDialog = useCallback(
        async (type: ExporterType) => {
            if (!fileExporterService || !extractTables?.emails) {
                return;
            }

            const mailsWithTags = getMailsWithTag(
                extractTables.emails,
                toDeleteIDs
            );

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

            const mails = formatEmailTable(mailsWithTags);
            await fileExporterService.export(type, mails, dialogPath.filePath);
        },
        [t, extractTables?.emails, fileExporterService, toDeleteIDs]
    );

    const emlExport = useCallback(async () => {
        if (!fileExporterService || !pstFile) return;

        const result = await dialog.showOpenDialog({
            properties: ["openDirectory"],
        });

        await fileExporterService.export("eml", pstFile, result.filePaths[0]);
    }, [fileExporterService, pstFile]);

    return {
        emlExport,
        openSaveDialog,
    };
};
