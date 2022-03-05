import { useService } from "@common/modules/ContainerModule";
import type { ExporterType } from "@common/modules/FileExporterModule";
import { formatEmailTable } from "@common/utils/exporter";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { usePstStore } from "../store/PSTStore";
import { dialog } from "../utils/electron";

interface UseExporter {
    openSaveDialog: (type: ExporterType) => void;
}

export const useExporter = (): UseExporter => {
    const fileExporterService = useService("fileExporterService");
    const tracker = useService("trackerService")?.getProvider();
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
            tracker?.track("Export Generated", {
                type,
            });
        },
        [t, extractTables?.emails, fileExporterService, tracker]
    );

    return {
        openSaveDialog,
    };
};
