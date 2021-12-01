import React, { useCallback } from "react";

import { useRouteContext } from "../../../renderer/context/RouterContext";
import { Dropzone } from "../../components/dropzone/Dropzone";
import { usePathContext } from "../../context/PathContext";
import { ACCEPTED_EXTENSION } from "../../utils/constants";
import style from "./StartScreen.module.scss";

export const StartScreen: React.FC = () => {
    const { changePath } = usePathContext();
    const { changeRoute } = useRouteContext();

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            changePath(acceptedFiles[0].path);
            changeRoute("DASHBOARD");
        },
        [changePath, changeRoute]
    );
    return (
        <div className={style["start-screen"]}>
            <Dropzone onDrop={onDrop} accept={ACCEPTED_EXTENSION} />
        </div>
    );
};
