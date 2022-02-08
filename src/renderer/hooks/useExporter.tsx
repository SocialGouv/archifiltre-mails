import { useService } from "@common/modules/ContainerModule";
import type { ExporterType } from "@common/modules/FileExporterModule";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { usePstStore } from "../store/PSTStore";
import { dialog } from "../utils/electron";
import { formatEmailTable } from "../utils/exporter";

interface UseExporter {
    openSaveDialog: (type: ExporterType) => void;
}

export const useExporter = (): UseExporter => {
    const fileExporterService = useService("fileExporterService");
    const { t } = useTranslation();
    const { extractTables } = usePstStore();

    const openSaveDialog = useCallback(
        async (type: ExporterType) => {
            if (!fileExporterService || !extractTables?.emails) {
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

            const mails = formatEmailTable(extractTables.emails);
            await fileExporterService.export(type, mails, dialogPath.filePath);
        },
        [t, extractTables?.emails, fileExporterService]
    );

    return {
        openSaveDialog,
    };
};
