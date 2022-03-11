import { toDecimalsFloat } from "@common/utils";
import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { StaticImage } from "../../components/common/staticImage/StaticImage";
import { Dropzone } from "../../components/dropzone/Dropzone";
import { useRouteContext } from "../../context/RouterContext";
import { usePstExtractor } from "../../hooks/usePstExtractor";
import { usePstStore } from "../../store/PSTStore";
import { ACCEPTED_EXTENSION } from "../../utils/constants";
import style from "./StartScreen.module.scss";

export const StartScreen: React.FC = () => {
    const { pstProgress, setPstFilePath } = usePstExtractor();
    const { pstFile } = usePstStore();

    const { changeRoute } = useRouteContext();

    const { t } = useTranslation();

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

    const progressClassName = pstProgress.elapsed
        ? `${style.startscreen__progress} ${style.active}`
        : `${style.startscreen__progress}`;

    return (
        <div className={style.startscreen}>
            <StaticImage className={style.logo} alt="logo" src="img/logo.png" />
            <Dropzone onDrop={onDrop} accept={ACCEPTED_EXTENSION} />
            <div className={progressClassName}>
                <ul>
                    <li>
                        <span>{t("startscreen.importInfo.emails")}</span>
                        <span>{pstProgress.countEmail}</span>
                    </li>
                    <li>
                        <span>{t("startscreen.importInfo.folders")}</span>
                        <span>{pstProgress.countFolder}</span>
                    </li>
                    <li>
                        <span>{t("startscreen.importInfo.attachedCount")}</span>
                        <span>{pstProgress.countAttachement}</span>
                    </li>
                    <li>
                        <span>{t("startscreen.importInfo.totalFiles")}</span>
                        <span>{pstProgress.countTotal}</span>
                    </li>
                    <li>
                        <span>{t("startscreen.importInfo.totalTime")}</span>
                        <span>
                            {toDecimalsFloat(pstProgress.elapsed / 1000, 2)}s
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    );
};
