import { useCallback, useEffect, useState } from "react";

import type { ExporterType } from "../exporters/Exporter";
import { exporters } from "../exporters/Exporter";
import { openDialogService } from "../services/OpenDialogService";
import { usePSTStore } from "../store/PSTStore";
import { formatEmailTable } from "../utils/exporter";

interface UseExporter {
    openSaveDialog: (type: ExporterType) => void;
}

export const useExporter = (): UseExporter => {
    const [path, setPath] = useState("");
    const [exportType, setExportType] = useState<ExporterType>("json");
    const { extractTables } = usePSTStore();

    const openSaveDialog = useCallback((type: ExporterType) => {
        openDialogService.openSaveDestinationWindow(type);
        setExportType(type);
    }, []);

    openDialogService.getSaveDestinationPath(setPath);

    useEffect(() => {
        void (async () => {
            if (extractTables?.emails) {
                const mails = formatEmailTable(extractTables.emails);
                await exporters[exportType].export(mails, path);
            }
        })();
    }, [path, exportType, extractTables?.emails]);

    return {
        openSaveDialog,
    };
};
