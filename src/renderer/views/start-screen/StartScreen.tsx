import { toDecimalsFloat } from "@common/utils";
import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Logo } from "../../components/common/logo/Logo";
import { CogPicto } from "../../components/common/pictos/picto";
import { Dropzone } from "../../components/dropzone/Dropzone";
import { useAutoUpdateContext } from "../../context/AutoUpdateContext";
import { useRouteContext } from "../../context/RouterContext";
import { usePstExtractor } from "../../hooks/usePstExtractor";
import { usePstStore } from "../../store/PSTStore";
import { toggleUserConfigPanel } from "../../store/UserConfigPanelStore";
import { ACCEPTED_EXTENSION } from "../../utils/constants";
import style from "./StartScreen.module.scss";

export const StartScreen: React.FC = () => {
    const { pstProgress, setPstFilePath } = usePstExtractor();
    const { pstFile } = usePstStore();

    const { changeRoute } = useRouteContext();
    const { updateInfo } = useAutoUpdateContext();

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
            <button
                className={
                    updateInfo
                        ? style.startscreen__open__config__update__available
                        : style.startscreen__open__config
                }
                onClick={toggleUserConfigPanel}
            >
                <CogPicto />
            </button>
            <Logo className={style.logo} />
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
