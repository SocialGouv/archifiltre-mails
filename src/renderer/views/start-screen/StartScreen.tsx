import React, { useCallback, useEffect } from "react";

import { useRouteContext } from "../../../renderer/context/RouterContext";
import { usePSTExtractor } from "../../../renderer/hooks/usePSTExtractor";
import { Dropzone } from "../../components/dropzone/Dropzone";
import { usePSTStore } from "../../store/PSTStore";
import { ACCEPTED_EXTENSION } from "../../utils/constants";
import style from "./StartScreen.module.scss";

export const StartScreen: React.FC = () => {
    const { pstProgress, setPstFilePath } = usePSTExtractor();
    const { pstFile } = usePSTStore();

    const { changeRoute } = useRouteContext();

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles[0]) {
                setPstFilePath(acceptedFiles[0].path);
            }
        },
        [setPstFilePath]
    );

    useEffect(() => {
        if (pstFile) {
            changeRoute("DASHBOARD");
        }
    }, [pstFile, changeRoute]);

    console.log(pstProgress);

    const progressClassName = pstProgress.elapsed
        ? `${style.startscreen__progress} ${style.active}`
        : `${style.startscreen__progress}`;

    return (
        <div className={style.startscreen}>
            <Dropzone onDrop={onDrop} accept={ACCEPTED_EXTENSION} />
            <div className={progressClassName}>
                <ul>
                    <li>
                        <span>Emails:</span>
                        <span>{pstProgress.countEmail}</span>
                    </li>
                    <li>
                        <span>Dossiers:</span>
                        <span>{pstProgress.countFolder}</span>
                    </li>
                    <li>
                        <span>PJ:</span>
                        <span>{pstProgress.countAttachement}</span>
                    </li>
                    <li>
                        <span>Total:</span>
                        <span>{pstProgress.countTotal}</span>
                    </li>
                    <li>
                        <span>Temps total:</span>
                        <span>{pstProgress.elapsed}</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};
