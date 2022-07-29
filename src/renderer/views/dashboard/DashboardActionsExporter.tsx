/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { useService } from "@common/modules/ContainerModule";
import type { FC } from "react";
import React from "react";

import { useExporter } from "../../hooks/useExporter";
import style from "./Dashboard.module.scss";

export const DashboardActionsExporter: FC<{ isExporterOpen: boolean }> = ({
    isExporterOpen,
}) => {
    const className = isExporterOpen
        ? `${style.dashboard__actions__exporter} ${style.active}`
        : style.dashboard__actions__exporter;

    const fileExporterService = useService("fileExporterService");

    const { openSaveDialog, emlExport } = useExporter();

    if (!fileExporterService) {
        return null;
    }

    return (
        <div className={className}>
            <ul>
                <li onClick={async () => emlExport()}>EML TEST</li>
                {fileExporterService.exporterTypes.map(
                    (exporterType, index) => (
                        <li
                            onClick={() => {
                                openSaveDialog(exporterType);
                            }}
                            key={index}
                        >
                            {exporterType.toUpperCase()}
                        </li>
                    )
                )}
            </ul>
        </div>
    );
};
