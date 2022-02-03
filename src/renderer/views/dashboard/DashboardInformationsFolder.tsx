import type { Any } from "@common/utils/type";
import type { FC } from "react";
import React from "react";

import type { UsePstStore } from "../../store/PSTStore";

export const DashboardInformationsFolder: FC<{
    mainInfos: NonNullable<UsePstStore["mainInfos"]>; // TODO: remove non null or handle loader
}> = ({ mainInfos }) => (
    <>
        <div>
            <strong>Type </strong>dossier
        </div>
        <div>
            <strong>Titre </strong>
            {mainInfos.data.name}
        </div>
        <div>
            <strong>Nombre de mails </strong>
            {mainInfos.data.size}
        </div>
        <div>
            <strong>Nombre de PJ </strong>?
        </div>
        <div>
            <strong>Représentation (en %) </strong>
            {mainInfos.percentage.toFixed(1)}
        </div>
        <div>
            <strong>Etat </strong>
            {(mainInfos.data as Any).tag}
            {/* TODO */}
        </div>
    </>
);
