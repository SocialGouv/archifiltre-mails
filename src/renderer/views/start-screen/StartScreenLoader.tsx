import type { PstProgressState } from "@common/modules/pst-extractor/type";
import React from "react";

import style from "./StartScreen.module.scss";

export type StartScreenLoaderProps = Pick<
    PstProgressState,
    "countAttachement" | "countEmail" | "countFolder" | "countTotal"
>;

export const StartScreenLoader: React.FC<StartScreenLoaderProps> = ({
    countEmail,
    countFolder,
    countAttachement,
    countTotal,
}) => (
    <>
        <div className={style.spinner} />
        <div className={style.circlePackingPstInfos}>
            <ul>
                <li>nombre d emails : </li>
                <li>{countEmail}</li>
                <li>nombre de dossiers parcourus : </li>
                <li>{countFolder}</li>
                <li>nombre de pj : </li>
                <li>{countAttachement}</li>
                <li>nombre d éléments : </li>
                <li>{countTotal}</li>
            </ul>
        </div>
    </>
);
