/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import type { FC } from "react";
import React from "react";

import type { ExporterType } from "../../exporters/Exporter";
import { useExporter } from "../../hooks/useExporter";
import style from "./Dashboard.module.scss";

const exporterTypeData: ExporterType[] = ["csv", "json", "xlsx"];

export const DashboardActionsExporter: FC<{ isExporterOpen: boolean }> = ({
    isExporterOpen,
}) => {
    const className = isExporterOpen
        ? `${style.dashboard__actions__exporter} ${style.active}`
        : style.dashboard__actions__exporter;

    const { openSaveDialog } = useExporter();

    return (
        <div className={className}>
            <ul>
                {exporterTypeData.map((exporterType, index) => (
                    <li
                        onClick={() => {
                            openSaveDialog(exporterType);
                        }}
                        key={index}
                    >
                        {exporterType.toUpperCase()}
                    </li>
                ))}
            </ul>
        </div>
    );
};
