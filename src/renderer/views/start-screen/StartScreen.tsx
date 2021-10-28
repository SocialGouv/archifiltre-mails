import React, { useCallback } from "react";

import { LayoutWorkspace } from "../../components/common/layout/LayoutWorkspace";
import { Dropzone } from "../../components/dropzone/Dropzone";
import { useRouteContext } from "../../context/RouterContext";
import { ACCEPTED_EXTENSION, DASHBOARD } from "../../utils/constants";
import style from "./StartScreen.module.scss";

export const StartScreen: React.FC = () => {
    // ################# TESTING ########################
    const { changeRoute } = useRouteContext();

    const goToHome = () => {
        changeRoute(DASHBOARD);
    };
    // #########################################

    const onDrop = useCallback((acceptedFiles, rejectediles) => {
        console.log(acceptedFiles, rejectediles);
    }, []);

    return (
        <LayoutWorkspace classname={style["start-screen"]}>
            <Dropzone onDrop={onDrop} accept={ACCEPTED_EXTENSION} />
            <button onClick={goToHome}>Go to home</button>
        </LayoutWorkspace>
    );
};
