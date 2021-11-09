import React, { useCallback } from "react";

import { LayoutWorkspace } from "../../components/common/layout/LayoutWorkspace";
import { Dropzone } from "../../components/dropzone/Dropzone";
import { useRouteContext } from "../../context/RouterContext";
import { usePathContext } from "../../context/TestContext";
import { ACCEPTED_EXTENSION, DASHBOARD } from "../../utils/constants";
import style from "./StartScreen.module.scss";

export const StartScreen: React.FC = () => {
    // ################# TESTING ########################
    const { changeRoute } = useRouteContext();

    // #########################################

    const { changePath, path } = usePathContext();

    const onDrop = useCallback(
        (acceptedFiles) => {
            changePath(acceptedFiles[0].path as string);
            changeRoute(DASHBOARD);
        },
        [changePath, changeRoute]
    );
    console.log("path from store  : ", path);
    return (
        <LayoutWorkspace classname={style["start-screen"]}>
            <Dropzone onDrop={onDrop} accept={ACCEPTED_EXTENSION} />
            {/* <button onClick={goToVizualisation}>Go to home</button> */}
        </LayoutWorkspace>
    );
};
